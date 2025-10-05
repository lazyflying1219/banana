// Cloudflare Pages Function: /api/generate - With detailed debug logging
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

  const promptRaw = String(body.prompt || '').trim();
  if (!promptRaw) {
    return json({ error: '缺少提示词 prompt' }, 400, corsHeaders);
  }

  // Aspect ratio to model name mapping
  // 根据选择的比例动态生成对应的模型名称
  const aspectRatio = (body.aspectRatio && String(body.aspectRatio).trim()) || '1:1';
  
  // 将比例转换为模型名称格式 (例如: "21:9" -> "ban21:9-gemini-2.5-flash-image-preview")
  const ratioForModel = aspectRatio.replace(':', '');  // "21:9" -> "219"
  const model = `ban${ratioForModel}-gemini-2.5-flash-image-preview`;
  
  console.log('=== API Request Debug ===');
  console.log('Received aspectRatio from frontend:', body.aspectRatio);
  console.log('Normalized aspectRatio:', aspectRatio);
  console.log('Generated model name:', model);

  // Ensure prompt clearly requests an image when using Gemini image preview variants
  let optimizedPrompt = promptRaw;
  const pr = optimizedPrompt.toLowerCase();
  if ((model.includes('gemini') || model.includes('image') || model.includes('ban'))
      && !(['generate', 'create', 'draw', '生成', '画'].some(k => pr.includes(k)))) {
    optimizedPrompt = `Generate an image: ${optimizedPrompt}`;
  }

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

  // 简化的请求体：完全依赖模型名称来控制图片比例
  // 模型名称格式: ban{ratio}-gemini-2.5-flash-image-preview
  // 例如: ban219-gemini-2.5-flash-image-preview (对应 21:9 比例)
  // 例如: ban169-gemini-2.5-flash-image-preview (对应 16:9 比例)
  // 例如: ban11-gemini-2.5-flash-image-preview (对应 1:1 比例)
  const forwardBody = {
    model,  // 使用根据aspectRatio动态生成的模型名称
    messages: [
      {
        role: 'user',
        content: content
      }
    ],
    stream: true
    // 不再需要 generation_config，完全由模型名称控制比例
  };

  console.log('=== Full request body to API ===');
  console.log(JSON.stringify(forwardBody, null, 2));
  console.log('=== End request body ===');

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
      debug: {
        model,
        aspectRatio,
        imagesCount: images.length,
        generationConfig: forwardBody.generation_config
      }
    }, 502, corsHeaders);
  }
  clearTimeout(timeoutId);

  console.log('API Response status:', apiResp.status);
  console.log('API Response headers:', Object.fromEntries(apiResp.headers.entries()));

  if (!apiResp.ok) {
    const errTxt = await safeText(apiResp);
    console.error('API Error response:', errTxt);
    return json({
      error: '上游API返回错误',
      status: apiResp.status,
      statusText: apiResp.statusText,
      details: errTxt?.slice(0, 2000),
      debug: {
        model,
        aspectRatio,
        imagesCount: images.length,
        generationConfig: forwardBody.generation_config
      },
      requestSent: forwardBody
    }, apiResp.status || 500, corsHeaders);
  }

  // Handle streaming response
  let fullContent = '';
  let buffer = '';
  let chunkCount = 0;
  
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
          chunkCount++;
          if (chunkCount <= 3) {
            console.log(`Stream chunk ${chunkCount}:`, line.slice(0, 200));
          }
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
            console.log('Parse error for line:', line.slice(0, 100), e.message);
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
    
    console.log('Total stream chunks received:', chunkCount);
    console.log('Stream content length:', fullContent.length);
    console.log('First 500 chars of content:', fullContent.slice(0, 500));
    
    // Try to parse as JSON to get proper structure
    let apiJson;
    try {
      apiJson = JSON.parse(fullContent);
      console.log('Parsed API response structure:', Object.keys(apiJson));
      if (apiJson.candidates) {
        console.log('Found candidates array, length:', apiJson.candidates.length);
      }
      if (apiJson.choices) {
        console.log('Found choices array, length:', apiJson.choices.length);
      }
    } catch {
      console.log('Content is not JSON, treating as raw content');
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
    
    console.log('Extracted imageUrl length:', parsed.imageUrl?.length || 0);
    console.log('Extracted text length:', parsed.text?.length || 0);
    
    if (!parsed.imageUrl) {
      console.log('Image not found in parsed content, searching raw...');
      const alt = extractFromRaw(fullContent);
      if (alt) {
        console.log('Found image in raw response, length:', alt.length);
        return json({
          src: alt,
          text: sanitizeText(parsed.text || ''),
          debugInfo: {
            model,
            aspectRatio,
            imagesCount: images.length,
            generationConfig: forwardBody.generation_config,
            success: true
          }
        }, 200, corsHeaders);
      }

      // Additional fallback: search for base64 patterns
      const base64Match = fullContent.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
      if (base64Match) {
        console.log('Found potential base64 pattern, length:', base64Match[0].length);
        const assumedImage = `data:image/png;base64,${base64Match[0]}`;
        return json({
          src: assumedImage,
          text: sanitizeText(parsed.text || ''),
          debugInfo: {
            model,
            aspectRatio,
            imagesCount: images.length,
            generationConfig: forwardBody.generation_config,
            success: true
          }
        }, 200, corsHeaders);
      }

      return json({
        error: 'API响应中未找到图片数据',
        providerResponsePreview: fullContent.slice(0, 2000),
        debugInfo: {
          model,
          aspectRatio,
          imagesCount: images.length,
          generationConfig: forwardBody.generation_config
        },
        requestSent: forwardBody,
        fullResponseForDebug: apiJson
      }, 500, corsHeaders);
    }

    console.log('=== Success - returning image ===');
    console.log('Image data URL prefix:', parsed.imageUrl.slice(0, 50));

    return json({
      src: parsed.imageUrl,
      text: sanitizeText(parsed.text || ''),
      debugInfo: {
        model,
        aspectRatio,
        imagesCount: images.length,
        generationConfig: forwardBody.generation_config,
        success: true,
        requestSent: forwardBody,
        streamChunks: chunkCount
      }
    }, 200, corsHeaders);
    
  } catch (e) {
    console.error('Stream processing error:', e);
    return json({
      error: '处理流式响应失败',
      details: e.message || String(e),
      debug: {
        model,
        aspectRatio,
        imagesCount: images.length,
        generationConfig: forwardBody.generation_config
      }
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
    console.log('Extracting from Gemini candidates format, parts count:', parts.length);
    for (const part of parts) {
      console.log('Part type:', part.type || 'unknown', 'keys:', Object.keys(part));
      // Text part
      if (part.text) {
        text += part.text;
      }
      // Inline image data
      if (part.inline_data) {
        const mimeType = part.inline_data.mime_type || 'image/png';
        const data = part.inline_data.data;
        console.log('Found inline_data, mime:', mimeType, 'data length:', data.length);
        imageUrl = `data:${mimeType};base64,${data}`;
        break;
      }
      // Image URL
      if (part.image_url?.url) {
        console.log('Found image_url');
        imageUrl = part.image_url.url;
        break;
      }
    }
  }

  // Fallback: check OpenAI format
  if (!imageUrl) {
    console.log('No image in Gemini format, trying OpenAI format');
    const choice = apiJson?.choices?.[0];
    const messageContent = choice?.message?.content;

    if (typeof messageContent === 'string') {
      console.log('Message content is string, length:', messageContent.length);
      text = messageContent;
      // Direct data URI
      const dataUriMatch = text.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\n\r]+/);
      if (dataUriMatch) {
        console.log('Found data URI in string');
        imageUrl = dataUriMatch[0].replace(/[\s\n\r]/g, '');
      }
      // Markdown image
      if (!imageUrl) {
        const mdMatch = text.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        if (mdMatch) {
          console.log('Found markdown image');
          imageUrl = mdMatch[1];
        }
      }
      // Plain URL
      if (!imageUrl) {
        const urlMatch = text.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)/i);
        if (urlMatch) {
          console.log('Found plain URL');
          imageUrl = urlMatch[0];
        }
      }
    } else if (Array.isArray(messageContent)) {
      console.log('Message content is array, length:', messageContent.length);
      for (const item of messageContent) {
        console.log('Item type:', item?.type);
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
    console.log('No image found in standard formats, doing deep search');
    const deep = deepSearchForImage(apiJson);
    if (deep) {
      console.log('Deep search found image');
      imageUrl = deep;
    }
  }

  return { imageUrl, text };
}

function deepSearchForImage(obj, depth = 0) {
  try {
    if (!obj || typeof obj !== 'object' || depth > 10) return null;
    
    // Check for inline_data structure (Gemini format)
    if (obj.inline_data?.data) {
      const mimeType = obj.inline_data.mime_type || 'image/png';
      console.log(`[depth=${depth}] Found inline_data`);
      return `data:${mimeType};base64,${obj.inline_data.data}`;
    }
    
    // Direct common fields
    if (obj.image && typeof obj.image === 'string' && obj.image.startsWith('data:image')) {
      console.log(`[depth=${depth}] Found obj.image`);
      return obj.image;
    }
    if (obj.url && typeof obj.url === 'string' && obj.url.startsWith('http')) {
      console.log(`[depth=${depth}] Found obj.url`);
      return obj.url;
    }
    if (obj.data && typeof obj.data === 'string' && obj.data.length > 100) {
      console.log(`[depth=${depth}] Found obj.data`);
      return `data:image/png;base64,${obj.data}`;
    }
    
    // Recurse into arrays
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const result = deepSearchForImage(obj[i], depth + 1);
        if (result) return result;
      }
    }
    
    // Recurse into objects
    for (const key of Object.keys(obj)) {
      const result = deepSearchForImage(obj[key], depth + 1);
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
      console.log('extractFromRaw: found data URI');
      return m[0].replace(/\\n|\\r|\\s|\\/g, '').replace(/[\s\n\r]/g, '');
    }
    // Look for standalone base64 (at least 500 chars)
    const base64Match = raw.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
    if (base64Match) {
      console.log('extractFromRaw: found base64 pattern');
      return `data:image/png;base64,${base64Match[0]}`;
    }
  } catch {}
  return null;
}
