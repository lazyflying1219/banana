// Cloudflare Pages Function: /api/generate
// Purpose: Ensure VELOERA correctly applies image_config.aspect_ratio without server-side overrides
// Key points derived from VELOERA docs and your working override:
// - Use OpenAI-compatible messages (field "messages" is required)
// - Use snake_case generation_config with image_config.aspect_ratio
// - Mirror generation_config into extra_body.generation_config
// - Disable streaming (stream: false) so config is reliably applied
// - If ratio != 1:1 and model ends with "-image-preview", auto-switch to "-image" for non-square output

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
  } catch {
    return json({ error: '无效的JSON请求体' }, 400, corsHeaders);
  }

  const apiKey = env.VELAO_API_KEY;
  if (!apiKey) {
    return json({
      error: '缺少API密钥',
      details: '请在环境变量中设置 VELAO_API_KEY'
    }, 500, corsHeaders);
  }

  // Inputs
  let model = String(body.model || 'vertexpic2-gemini-2.5-flash-image-preview').trim();
  const promptRaw = String(body.prompt || '').trim();
  if (!promptRaw) {
    return json({ error: '缺少提示词 prompt' }, 400, corsHeaders);
  }
  const aspectRatio = (body.aspectRatio && String(body.aspectRatio).trim()) || '1:1';

  // If using preview model but want non-1:1 ratio, switch to non-preview for stable ratio support
  if (aspectRatio !== '1:1' && model.endsWith('-image-preview')) {
    model = model.replace('-image-preview', '-image');
  }

  // Ensure prompt clearly asks for image
  let optimizedPrompt = promptRaw;
  const pr = optimizedPrompt.toLowerCase();
  if ((model.includes('gemini') || model.includes('image') || model.includes('vertexpic'))
      && !(['generate', 'create', 'draw', '生成', '画'].some(k => pr.includes(k)))) {
    optimizedPrompt = `Generate an image: ${optimizedPrompt}`;
  }

  // Optional images
  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

  // OpenAI-compatible multimodal message content
  const content = [{ type: 'text', text: optimizedPrompt }];
  for (const img of images) {
    content.push({ type: 'image_url', image_url: { url: img } });
  }

  // Gemini-native parts (included in extra_body for maximum compatibility)
  const parts = [{ text: optimizedPrompt }];
  for (const img of images) {
    if (typeof img === 'string' && img.startsWith('data:image/')) {
      const m = img.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (m) parts.push({ inline_data: { mime_type: m[1], data: m[2] } });
    } else if (typeof img === 'string' && /^https?:\/\//i.test(img)) {
      // Some providers won't fetch remote URLs in parts; include a reference line
      parts.push({ text: `Reference image URL: ${img}` });
    }
  }

  // VELOERA-compatible generation_config (snake_case) exactly like your working override
  const generationConfig = {
    thinkingConfig: null,
    responseModalities: ['TEXT', 'IMAGE'],
    image_config: {
      aspect_ratio: aspectRatio
    }
  };

  // Build final request body
  const forwardBody = {
    model,
    messages: [
      { role: 'user', content }
    ],
    // Non-stream to ensure config is applied reliably across proxies
    stream: false,
    // Primary (snake_case) placement at top-level
    generation_config: generationConfig,
    // Mirror into extra_body for proxies that only read from here
    extra_body: {
      generation_config: generationConfig,
      // Provide Gemini-native contents as an extra hint for router implementations
      contents: [{ role: 'user', parts }]
    }
  };

  const apiUrl = 'https://veloe.onrender.com/v1/chat/completions';

  // Execute with timeout
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
      debugInfo: buildDebug(model, aspectRatio, images.length, generationConfig),
      requestSent: forwardBody
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
      debugInfo: buildDebug(model, aspectRatio, images.length, generationConfig),
      requestSent: forwardBody
    }, apiResp.status || 500, corsHeaders);
  }

  // Non-stream parse
  let apiJson;
  const contentType = apiResp.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      apiJson = await apiResp.json();
    } else {
      const txt = await safeText(apiResp);
      try {
        apiJson = JSON.parse(txt);
      } catch {
        apiJson = { choices: [{ message: { content: txt } }] };
      }
    }
  } catch (e) {
    const txt = await safeText(apiResp);
    apiJson = { choices: [{ message: { content: txt } }] };
  }

  // Extract image and optional text
  const parsed = extractImageAndText(apiJson);

  // Fallbacks if structured extraction failed
  if (!parsed.imageUrl) {
    const rawText = JSON.stringify(apiJson);
    const alt = extractFromRaw(rawText);
    if (alt) {
      return json({
        src: alt,
        text: sanitizeText(parsed.text || ''),
        debugInfo: {
          ...buildDebug(model, aspectRatio, images.length, generationConfig, true),
          requestSent: forwardBody,
          providerResponsePreview: rawText.slice(0, 2000)
        },
        fullResponseForDebug: apiJson
      }, 200, corsHeaders);
    }

    const base64Match = rawText.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
    if (base64Match) {
      const assumedImage = `data:image/png;base64,${base64Match[0]}`;
      return json({
        src: assumedImage,
        text: sanitizeText(parsed.text || ''),
        debugInfo: {
          ...buildDebug(model, aspectRatio, images.length, generationConfig, true),
          requestSent: forwardBody,
          providerResponsePreview: rawText.slice(0, 2000)
        },
        fullResponseForDebug: apiJson
      }, 200, corsHeaders);
    }

    return json({
      error: 'API响应中未找到图片数据',
      providerResponsePreview: JSON.stringify(apiJson).slice(0, 2000),
      debugInfo: buildDebug(model, aspectRatio, images.length, generationConfig),
      requestSent: forwardBody,
      fullResponseForDebug: apiJson
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
  return { model, aspectRatio, imagesCount, success, config };
}

function extractImageAndText(apiJson) {
  let imageUrl = null;
  let text = '';

  // Gemini-style (candidates)
  const candidate = apiJson?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (Array.isArray(parts)) {
    for (const part of parts) {
      if (part?.text) text += part.text;
      if (part?.inline_data?.data) {
        const mimeType = part.inline_data.mime_type || 'image/png';
        imageUrl = `data:${mimeType};base64,${part.inline_data.data}`;
        break;
      }
      if (part?.image_url?.url) {
        imageUrl = part.image_url.url;
        break;
      }
    }
  }

  // OpenAI-style fallback
  if (!imageUrl) {
    const choice = apiJson?.choices?.[0];
    const messageContent = choice?.message?.content;

    if (typeof messageContent === 'string') {
      text = messageContent;
      const dataUriMatch = text.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\n\r]+/);
      if (dataUriMatch) imageUrl = dataUriMatch[0].replace(/[\s\n\r]/g, '');
      if (!imageUrl) {
        const mdMatch = text.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        if (mdMatch) imageUrl = mdMatch[1];
      }
      if (!imageUrl) {
        const urlMatch = text.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)/i);
        if (urlMatch) imageUrl = urlMatch[0];
      }
    } else if (Array.isArray(messageContent)) {
      for (const item of messageContent) {
        if (item?.type === 'image_url' && item.image_url?.url) { imageUrl = item.image_url.url; break; }
        if (item?.type === 'image' && item.source?.data) {
          const mt = item.source.media_type || 'png';
          imageUrl = `data:image/${mt};base64,${item.source.data}`;
          break;
        }
        if (item?.type === 'text' && item.text) text += item.text;
      }
    }
  }

  if (!imageUrl) {
    const deep = deepSearchForImage(apiJson);
    if (deep) imageUrl = deep;
  }

  return { imageUrl, text };
}

function deepSearchForImage(obj) {
  try {
    if (!obj || typeof obj !== 'object') return null;

    if (obj.inline_data?.data) {
      const mimeType = obj.inline_data.mime_type || 'image/png';
      return `data:${mimeType};base64,${obj.inline_data.data}`;
    }
    if (typeof obj.image === 'string' && obj.image.startsWith('data:image')) return obj.image;
    if (typeof obj.url === 'string' && obj.url.startsWith('http')) return obj.url;
    if (typeof obj.data === 'string' && obj.data.length > 100) {
      return `data:image/png;base64,${obj.data}`;
    }

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const r = deepSearchForImage(item);
        if (r) return r;
      }
    } else {
      for (const k of Object.keys(obj)) {
        const r = deepSearchForImage(obj[k]);
        if (r) return r;
      }
    }
  } catch {}
  return null;
}

function extractFromRaw(raw) {
  try {
    const m = raw.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=\\n\\r\\s]+/);
    if (m) return m[0].replace(/\\n|\\r|\\s|\\/g, '').replace(/[\s\n\r]/g, '');
    const base64Match = raw.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
    if (base64Match) return `data:image/png;base64,${base64Match[0]}`;
  } catch {}
  return null;
}
