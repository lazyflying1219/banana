// Cloudflare Pages Function: /api/generate
// 将前端的请求代理到 veloe API，KEY 从环境变量读取
export async function onRequest(context) {
  // 从上下文中解构出请求和环境变量
  const { request, env } = context;

  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*', // 生产环境中建议替换为你的域名
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // 只允许 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const apiKey = env.VELAO_API_KEY; // 从环境变量中获取 API Key

    if (!apiKey) {
      // 如果没有配置 API Key，返回一个占位符图片用于测试
      const placeholderUrl = `https://placehold.co/1024x1024/000000/FFFFFF/png?text=API%20Key%20Not%20Set\\n${encodeURIComponent(body.prompt)}`;
      return new Response(JSON.stringify({ src: placeholderUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 构造转发到真实 API 的请求体
    const forwardBody = {
      model: body.model || 'vertexpic-gemini-2.5-flash-image-preview',
      prompt: body.prompt,
      images: body.images || [], // base64 图像数组
      // 根据你的 API 文档，可能需要其他参数
    };

    const apiResponse = await fetch('https://veloe.onrender.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(forwardBody),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Upstream API error: ${apiResponse.status}`, errorText);
      return new Response(JSON.stringify({ error: 'Upstream API error', details: errorText }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const responseData = await apiResponse.json();

    // --- Data Transformation ---
    // The upstream API might return data in a different format.
    // We need to find the image URL and adapt it to what the frontend expects ({ src: '...' }).
    let imageUrl;

    // Try to find URL in common response formats
    // Case 1: DALL-E-like response { data: [{ url: ... }] }
    if (responseData.data && Array.isArray(responseData.data) && responseData.data.url) {
        imageUrl = responseData.data.url;
    }
    // Case 2: DALL-E Base64 response { data: [{ b64_json: ... }] }
    else if (responseData.data && Array.isArray(responseData.data) && responseData.data.b64_json) {
        imageUrl = `data:image/png;base64,${responseData.data[0].b64_json}`;
    }
    // Case 3: Chat-like response { choices: [{ message: { content: "...url..." } }] }
    else if (responseData.choices && Array.isArray(responseData.choices) && responseData.choices.message && responseData.choices.message.content) {
        const content = responseData.choices.message.content;
        const urlMatch = content.match(/https?:\/\/[^\s"']+/);
        if (urlMatch) {
            imageUrl = urlMatch;
        }
    }
    // Case 4: Other common direct formats
    else if (responseData.output_url) {
        imageUrl = responseData.output_url;
    } else if (responseData.src) {
        imageUrl = responseData.src;
    } else if (typeof responseData.data === 'string' && responseData.data.startsWith('http')) {
        imageUrl = responseData.data;
    }

    if (!imageUrl) {
      console.error('Could not extract image URL from upstream API response:', JSON.stringify(responseData, null, 2));
      return new Response(JSON.stringify({ error: 'Could not find a valid image URL in the API response.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Prepare the response for the frontend in the expected format.
    const frontendResponse = {
      src: imageUrl
    };

    // 将转换后的数据返回给前端
    return new Response(JSON.stringify(frontendResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error('Error in Pages Function:', err);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
