// Cloudflare Pages Function: /api/generate
// FINAL, CORRECTED version. This function now uses the chat completions endpoint 
// with a specific tool definition to reliably trigger image generation.
export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const apiKey = env.VELAO_API_KEY;

    if (!apiKey) {
      const placeholderUrl = `https://placehold.co/1024x1024/000000/FFFFFF/png?text=API%20Key%20Not%20Set\\n${encodeURIComponent(body.prompt)}`;
      return new Response(JSON.stringify({ src: placeholderUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 尝试多种API格式，模拟CherryStudio的请求方式
    const modelName = body.model || 'vertexpic-gemini-2.5-flash-image-preview';

    // 格式1: 标准OpenAI格式
    let forwardBody = {
      model: modelName,
      messages: [{
        role: "user",
        content: body.prompt
      }],
      max_tokens: 4096,
      temperature: 0.7,
      stream: false
    };

    // 格式2: 如果是Gemini模型，添加特殊配置
    if (modelName.includes('gemini')) {
      forwardBody.generationConfig = {
        responseModalities: ["IMAGE", "TEXT"]
      };
    }

    // 格式3: 如果有图片，使用多模态格式
    if (body.images && body.images.length > 0) {
      const content = [
        {
          type: "text",
          text: body.prompt
        }
      ];

      body.images.forEach(imageData => {
        content.push({
          type: "image_url",
          image_url: {
            url: imageData
          }
        });
      });

      forwardBody.messages[0].content = content;
    }

    // 添加调试信息到响应中
    const debugInfo = {
      requestModel: modelName,
      hasImages: !!(body.images && body.images.length > 0),
      promptLength: body.prompt ? body.prompt.length : 0,
      timestamp: new Date().toISOString()
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
      let errorDetails;

      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { rawError: errorText };
      }

      return new Response(JSON.stringify({
        error: `API请求失败 (HTTP ${apiResponse.status})`,
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        details: errorDetails,
        requestBody: forwardBody,
        apiUrl: 'https://veloe.onrender.com/v1/chat/completions'
      }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const responseData = await apiResponse.json();

    let imageUrl = null;
    let responseText = '';

    // 尝试多种方式解析响应
    if (responseData.choices && responseData.choices.length > 0) {
      const choice = responseData.choices[0];
      const messageContent = choice?.message?.content;

      if (typeof messageContent === 'string') {
        responseText = messageContent;

        // 方法1: 查找base64图片数据
        const dataUriMatch = messageContent.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/);
        if (dataUriMatch) {
          imageUrl = dataUriMatch[0];
        }

        // 方法2: 查找图片URL
        if (!imageUrl) {
          const urlMatch = messageContent.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)/i);
          if (urlMatch) {
            imageUrl = urlMatch[0];
          }
        }

        // 方法3: 查找markdown格式的图片
        if (!imageUrl) {
          const markdownMatch = messageContent.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
          if (markdownMatch) {
            imageUrl = markdownMatch[1];
          }
        }
      } else if (Array.isArray(messageContent)) {
        // 处理数组格式的内容
        for (const item of messageContent) {
          if (item.type === 'image_url' && item.image_url?.url) {
            imageUrl = item.image_url.url;
            break;
          } else if (item.type === 'text') {
            responseText += item.text || '';
          }
        }
      }
    }

    // 如果还是没找到图片，尝试其他字段
    if (!imageUrl) {
      // 检查是否有直接的图片字段
      if (responseData.image) {
        imageUrl = responseData.image;
      } else if (responseData.data && responseData.data[0]?.url) {
        imageUrl = responseData.data[0].url;
      } else if (responseData.url) {
        imageUrl = responseData.url;
      }
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({
        error: 'API响应中未找到图片数据',
        details: '请检查API配置和模型是否支持图片生成',
        debugInfo: debugInfo,
        requestBody: forwardBody,
        rawResponse: responseData,
        responseText: responseText,
        suggestions: [
          '1. 检查模型名称是否正确',
          '2. 确认API密钥有效',
          '3. 验证提示词是否包含生图指令',
          '4. 检查API服务是否正常运行'
        ]
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const frontendResponse = {
      src: imageUrl
    };

    return new Response(JSON.stringify(frontendResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: '服务器内部错误',
      details: err.message,
      stack: err.stack,
      requestBody: body,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
