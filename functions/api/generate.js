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

    // Use the correct Chat Completions format for the request body, as confirmed by cURL test.
    const forwardBody = {
      model: body.model || 'vertexpic-gemini-2.5-flash-image-preview',
      messages: [{
        role: "user",
        content: body.prompt
      }]
      // Note: The 'images' array is not part of the standard chat completions message format.
      // If image-to-image is needed, the API must support a different format for that.
      // For now, we are focusing on text-to-image based on the successful cURL test.
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

    // --- Final, Targeted Data Transformation based on cURL results ---
    let imageUrl = null;

    // The successful cURL test indicates the response is in the 'choices' array.
    if (responseData.choices && Array.isArray(responseData.choices) && responseData.choices.length > 0) {
      // FIX 1: Get the first element from the 'choices' array.
      const choice = responseData.choices;
      if (choice && choice.message && typeof choice.message.content === 'string') {
        const content = choice.message.content;
        
        // The most likely format is a data URI for a Base64 image, as you suspected.
        const dataUriMatch = content.match(/data:image\/[a-zA-Z]+;base64,[^"'\s]+/);
        if (dataUriMatch && dataUriMatch.length > 0) {
          // FIX 2: Use the matched string, which is the first element of the match array.
          imageUrl = dataUriMatch;
        }
      }
    }

    if (!imageUrl) {
      console.error('FINAL ATTEMPT FAILED: Could not extract Base64 data URI from the API response:', JSON.stringify(responseData, null, 2));
      return new Response(JSON.stringify({ error: 'The API response format was not as expected or did not contain an image.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Prepare the response for the frontend in the expected { "src": "..." } format.
    const frontendResponse = {
      src: imageUrl
    };

    // Return the correctly formatted data to the frontend.
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
