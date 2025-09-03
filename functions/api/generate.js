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

    // 将从 API 收到的数据原样返回给前端
    return new Response(JSON.stringify(responseData), {
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
