// Cloudflare Pages Function: /api/generate - Refactored minimal stable version
// Goal: guarantee aspect_ratio passthrough for vertexpic2-gemini-2.5-flash-image-preview
// Strategy:
// - Non-stream request for simplicity and reliability
// - Always use multi-modal content array format (text + optional image_url items)
// - Always include generation_config exactly as required and mirror into extra_body
// - Provide concise debug info back to frontend

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

  // Build multi-modal content array (even if only text)
  const content = [
    { type: 'text', text: optimizedPrompt }
  ];
  for (const img of images) {
    content.push({
      type: 'image_url',
      image_url: { url: img }
    });
  }

  // Official Gemini API format
  const generationConfig = {
    thinkingConfig: null,
    responseModalities: ['TEXT', 'IMAGE'],
    imageConfig: { aspectRatio: aspectRatio }
  };

  // Final request body to provider
  const forwardBody = {
    model,
    messages: [
      { role: 'user', content }
    ],
    // Use stream to receive image data
    stream: true,
    // Primary placement - use camelCase for Gemini API
    generationConfig: generationConfig,
    // Mirror into extra_body for compatibility
    extra_body: {
      generationConfig: generationConfig
    }
  };

  const apiUrl = 'https://veloe.onrender.com/v1/chat/completions';

  // Execute with timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s hard timeout
  let apiResp;
  let apiJson;
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
      debug: buildDebug(model, aspectRatio, images.length, config)
    }, apiResp.status || 500, corsHeaders);
  }

  // Handle streaming response to extract image data
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
              if (data.choices?.[0]?.delta?.content) {
                fullContent += data.choices[0].delta.content;
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
          if (data.choices?.[0]?.delta?.content) {
            fullContent += data.choices[0].delta.content;
          }
        }
      } catch (e) {
        console.log('Parse error for final buffer');
      }
    }
    
    console.log('Stream content length:', fullContent.length);
    
    // Construct response object
    apiJson = {
      choices: [{
        message: {
          content: fullContent
        }
      }]
    };
  } catch (e) {
    return json({
      error: '处理流式响应失败',
      details: e.message || String(e),
      debug: buildDebug(model, aspectRatio, images.length, config)
    }, 502, corsHeaders);
  }

  // Extract image and optional text
  const parsed = extractImageAndText(apiJson);
  
  // If not found in content, search everywhere for base64 image data
  if (!parsed.imageUrl) {
    console.log('Image not found in content, searching entire response...');
    const rawText = JSON.stringify(apiJson);
    const alt = extractFromRaw(rawText);
    if (alt) {
      console.log('Found image in raw response, length:', alt.length);
      return json({
        src: alt,
        text: sanitizeText(parsed.text || ''),
        debugInfo: buildDebug(model, aspectRatio, images.length, config, true)
      }, 200, corsHeaders);
    }

    // Additional fallback: search for any long base64 strings
    const base64Match = rawText.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
    if (base64Match) {
      console.log('Found potential base64 pattern, assuming PNG');
      const assumedImage = `data:image/png;base64,${base64Match[0]}`;
      return json({
        src: assumedImage,
        text: sanitizeText(parsed.text || ''),
        debugInfo: buildDebug(model, aspectRatio, images.length, config, true)
      }, 200, corsHeaders);
    }

    return json({
      error: 'API响应中未找到图片数据',
      providerResponsePreview: JSON.stringify(apiJson).slice(0, 2000),
      debugInfo: buildDebug(model, aspectRatio, images.length, config),
      fullResponseForDebug: apiJson // Include full response for debugging
    }, 500, corsHeaders);
  }

  return json({
    src: parsed.imageUrl,
    text: sanitizeText(parsed.text || ''),
    debugInfo: {
      ...buildDebug(model, aspectRatio, images.length, generationConfig, true),
      requestSent: forwardBody
    },
    fullResponseForDebug: apiJson
  }, 200, corsHeaders);
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

  // If still nothing, search deeply for known structures
  if (!imageUrl) {
    const deep = deepSearchForImage(apiJson);
    if (deep) imageUrl = deep;
  }

  return { imageUrl, text };
}

function deepSearchForImage(obj) {
  // Look for common fields recursively
  try {
    if (!obj || typeof obj !== 'object') return null;
    // Direct common fields
    if (obj.image && typeof obj.image === 'string' && obj.image.startsWith('data:image')) return obj.image;
    if (obj.url && typeof obj.url === 'string' && obj.url.startsWith('http')) return obj.url;
    if (Array.isArray(obj.data)) {
      for (const d of obj.data) {
        const u = deepSearchForImage(d);
        if (u) return u;
      }
    }
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      const res = deepSearchForImage(v);
      if (res) return res;
    }
  } catch {}
  return null;
}

function extractFromRaw(raw) {
  try {
    const m = raw.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=\\n\\r\\s]+/);
    if (m) {
      return m[0].replace(/\\n|\\r|\\s|\\/g, '').replace(/[\s\n\r]/g, '');
    }
  } catch {}
  return null;
}
