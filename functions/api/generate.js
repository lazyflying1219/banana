// Cloudflare Pages Function: /api/generate - Fixed for veloe proxy compatibility
// Goal: guarantee aspect_ratio passthrough for vertexpic2-gemini-2.5-flash-image-preview

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = buildCorsHeaders(request, env);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ error: '无效的JSON请求体' }, 400, corsHeaders);
  }

  const apiKey = env.VELAO_API_KEY;
  if (!apiKey) {
    return json({
      error: '缺少API密钥',
      details: '请在环境变量中设置 VELAO_API_KEY',
    }, 500, corsHeaders);
  }

  const model = String(body.model || 'vertexpic2-gemini-2.5-flash-image-preview').trim();
  const promptRaw = String(body.prompt || '').trim();
  if (!promptRaw) {
    return json({ error: '缺少提示词 prompt' }, 400, corsHeaders);
  }

  // Ensure prompt clearly requests an image when using Gemini image preview variants
  let optimizedPrompt = promptRaw;
  const pr = optimizedPrompt.toLowerCase();
  if ((model.includes('gemini') || model.includes('image') || model.includes('vertexpic'))
      && !(['generate', 'create', 'draw', '生成', '画'].some(k => pr.includes(k)))) {
    optimizedPrompt = `Generate an image: ${optimizedPrompt}`;
  }

  // Aspect ratio passthrough
  const aspectRatio = (body.aspectRatio && String(body.aspectRatio).trim()) || '1:1';

  // Optional user images (data URLs or remote URLs)
  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

  // Build multi-modal content array for OpenAI format
  const content = [
    { type: 'text', text: optimizedPrompt }
  ];
  
  for (const img of images) {
    content.push({
      type: 'image_url',
      image_url: { url: img }
    });
  }

  // Gemini config structure (as per official docs)
  const config = {
    thinkingConfig: null,
    responseModalities: ['IMAGE'],  // Use 'IMAGE' not 'TEXT' when generating images
    imageConfig: {
      aspectRatio: aspectRatio
    }
  };

  // Final request body - use OpenAI messages format but add Gemini config
  const forwardBody = {
    model,
    messages: [
      { 
        role: 'user', 
        content: content 
      }
    ],
    stream: true,
    // Add config at root level
    config: config,
    // Also try in extra_body for compatibility
    extra_body: {
      config: config
    }
  };

  const apiUrl = 'https://veloe.onrender.com/v1/chat/completions';

  // Execute with timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  let apiResp;
  
  try {
    apiResp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(forwardBody),
      signal: controller.signal
    });
  } catch (e) {
    clearTimeout(timeoutId);
    return json({
      error: '请求上游API失败',
      details: e.message || String(e),
      debug: buildDebug(model, aspectRatio, images.length, config)
    }, 502, corsHeaders);
  }
  clearTimeout(timeoutId);

  if (!apiResp.ok) {
    const errTxt = await safeText(apiResp);
    return json({
      error: '上游API返回错误',
      status: apiResp.status,
      statusText: apiResp.statusText,
      details: errTxt?.slice(0, 2000),
      debug: buildDebug(model, aspectRatio, images.length, config),
      requestSent: forwardBody
    }, apiResp.status || 500, corsHeaders);
  }

  // Handle streaming response
  let fullContent = '';
  let buffer = '';
  
  try {
    const reader = apiResp.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const jsonStr = line.slice(6).trim();
            if (jsonStr) {
              const data = JSON.parse(jsonStr);
              // Handle different response formats
              const content = data.choices?.[0]?.delta?.content 
                           || data.candidates?.[0]?.content?.parts?.[0]?.text
                           || data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
              if (content) {
                fullContent += content;
              }
            }
          } catch (e) {
            console.log('Parse error for line:', line.slice(0, 100));
          }
        }
      }
    }
    
    // Process final buffer
    if (buffer.startsWith('data: ') && buffer !== 'data: [DONE]') {
      try {
        const jsonStr = buffer.slice(6).trim();
        if (jsonStr) {
          const data = JSON.parse(jsonStr);
          const content = data.choices?.[0]?.delta?.content 
                       || data.candidates?.[0]?.content?.parts?.[0]?.text
                       || data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
          if (content) {
            fullContent += content;
          }
        }
      } catch (e) {
        console.log('Parse error for final buffer');
      }
    }
    
    console.log('Stream content length:', fullContent.length);
    
    // Try to parse as JSON to get proper structure
    let apiJson;
    try {
      apiJson = JSON.parse(fullContent);
    } catch {
      // If not JSON, construct response object
      apiJson = {
        choices: [{
          message: {
            content: fullContent
          }
        }]
      };
    }
    
    // Extract image and optional text
    const parsed = extractImageAndText(apiJson);
    
    if (!parsed.imageUrl) {
      console.log('Image not found in parsed content, searching raw...');
      const alt = extractFromRaw(fullContent);
      if (alt) {
        console.log('Found image in raw response');
        return json({
          src: alt,
          text: sanitizeText(parsed.text || ''),
          debugInfo: buildDebug(model, aspectRatio, images.length, config, true)
        }, 200, corsHeaders);
      }

      // Additional fallback: search for base64 patterns
      const base64Match = fullContent.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
      if (base64Match) {
        console.log('Found potential base64 pattern');
        const assumedImage = `data:image/png;base64,${base64Match[0]}`;
        return json({
          src: assumedImage,
          text: sanitizeText(parsed.text || ''),
          debugInfo: buildDebug(model, aspectRatio, images.length, config, true)
        }, 200, corsHeaders);
      }

      return json({
        error: 'API响应中未找到图片数据',
        providerResponsePreview: fullContent.slice(0, 2000),
        debugInfo: buildDebug(model, aspectRatio, images.length, config),
        requestSent: forwardBody,
        fullResponseForDebug: apiJson
      }, 500, corsHeaders);
    }

    return json({
      src: parsed.imageUrl,
      text: sanitizeText(parsed.text || ''),
      debugInfo: {
        ...buildDebug(model, aspectRatio, images.length, config, true),
        requestSent: forwardBody
      }
    }, 200, corsHeaders);
    
  } catch (e) {
    return json({
      error: '处理流式响应失败',
      details: e.message || String(e),
      debug: buildDebug(model, aspectRatio, images.length, config)
    }, 502, corsHeaders);
  }
}

// Helpers

function buildCorsHeaders(request, env) {
  try {
    const origin = request.headers.get('Origin') || '';
    const allowList = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    let allowOrigin = '*';
    if (allowList.length > 0 && !allowList.includes('*')) {
      if (origin && allowList.includes(origin)) allowOrigin = origin;
      else allowOrigin = allowList[0];
    }
    return {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
  } catch {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
  }
}

function json(obj, status, corsHeaders) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', ...(corsHeaders || {}) }
  });
}

async function safeText(resp) {
  try { return await resp.text(); } catch { return ''; }
}

function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  try {
    return text.replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\n\r]+/g, '').trim();
  } catch {
    return String(text);
  }
}

function buildDebug(model, aspectRatio, imagesCount, config, success = false) {
  return {
    model,
    aspectRatio,
    imagesCount,
    success,
    config
  };
}

function extractImageAndText(apiJson) {
  let imageUrl = null;
  let text = '';

  // Check for Gemini format (candidates array)
  const candidate = apiJson?.candidates?.[0];
  const parts = candidate?.content?.parts;

  if (Array.isArray(parts)) {
    for (const part of parts) {
      // Text part
      if (part.text) {
        text += part.text;
      }
      // Inline image data
      if (part.inline_data) {
        const mimeType = part.inline_data.mime_type || 'image/png';
        const data = part.inline_data.data;
        imageUrl = `data:${mimeType};base64,${data}`;
        break;
      }
      // Image URL
      if (part.image_url?.url) {
        imageUrl = part.image_url.url;
        break;
      }
    }
  }

  // Fallback: check OpenAI format
  if (!imageUrl) {
    const choice = apiJson?.choices?.[0];
    const messageContent = choice?.message?.content;

    if (typeof messageContent === 'string') {
      text = messageContent;
      // Direct data URI
      const dataUriMatch = text.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\n\r]+/);
      if (dataUriMatch) {
        imageUrl = dataUriMatch[0].replace(/[\s\n\r]/g, '');
      }
      // Markdown image
      if (!imageUrl) {
        const mdMatch = text.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        if (mdMatch) imageUrl = mdMatch[1];
      }
      // Plain URL
      if (!imageUrl) {
        const urlMatch = text.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)/i);
        if (urlMatch) imageUrl = urlMatch[0];
      }
    } else if (Array.isArray(messageContent)) {
      for (const item of messageContent) {
        if (item?.type === 'image_url' && item.image_url?.url) {
          imageUrl = item.image_url.url;
          break;
        } else if (item?.type === 'image' && item.source?.data) {
          imageUrl = `data:image/${item.source.media_type || 'png'};base64,${item.source.data}`;
          break;
        } else if (item?.type === 'text' && item.text) {
          text += item.text;
        }
      }
    }
  }

  // Deep search if still nothing found
  if (!imageUrl) {
    const deep = deepSearchForImage(apiJson);
    if (deep) imageUrl = deep;
  }

  return { imageUrl, text };
}

function deepSearchForImage(obj) {
  try {
    if (!obj || typeof obj !== 'object') return null;
    
    // Check for inline_data structure (Gemini format)
    if (obj.inline_data?.data) {
      const mimeType = obj.inline_data.mime_type || 'image/png';
      return `data:${mimeType};base64,${obj.inline_data.data}`;
    }
    
    // Direct common fields
    if (obj.image && typeof obj.image === 'string' && obj.image.startsWith('data:image')) return obj.image;
    if (obj.url && typeof obj.url === 'string' && obj.url.startsWith('http')) return obj.url;
    if (obj.data && typeof obj.data === 'string' && obj.data.length > 100) {
      return `data:image/png;base64,${obj.data}`;
    }
    
    // Recurse into arrays
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = deepSearchForImage(item);
        if (result) return result;
      }
    }
    
    // Recurse into objects
    for (const key of Object.keys(obj)) {
      const result = deepSearchForImage(obj[key]);
      if (result) return result;
    }
  } catch {}
  return null;
}

function extractFromRaw(raw) {
  try {
    // Look for data URI
    const m = raw.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=\\n\\r\\s]+/);
    if (m) {
      return m[0].replace(/\\n|\\r|\\s|\\/g, '').replace(/[\s\n\r]/g, '');
    }
    // Look for standalone base64 (at least 500 chars)
    const base64Match = raw.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
    if (base64Match) {
      return `data:image/png;base64,${base64Match[0]}`;
    }
  } catch {}
  return null;
}
