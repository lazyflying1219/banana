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

    // 构建请求体 - 支持多种API格式
    let forwardBody;
    
    // 如果有上传的图片，使用多模态格式
    if (body.images && body.images.length > 0) {
      const content = [
        {
          type: "text",
          text: body.prompt
        }
      ];
      
      // 添加图片内容
      body.images.forEach(imageData => {
        content.push({
          type: "image_url",
          image_url: {
            url: imageData
          }
        });
      });
      
      forwardBody = {
        model: body.model || 'vertexpic-gemini-2.5-flash-image-preview',
        messages: [{
          role: "user",
          content: content
        }],
        max_tokens: 4096,
        temperature: 0.7
      };
    } else {
      // 纯文本生图
      forwardBody = {
        model: body.model || 'vertexpic-gemini-2.5-flash-image-preview',
        messages: [{
          role: "user",
          content: body.prompt
        }],
        max_tokens: 4096,
        temperature: 0.7
      };
    }
    
    // 如果模型支持，添加生成配置
    if (body.model && body.model.includes('gemini')) {
      forwardBody.generationConfig = {
        responseModalities: ["IMAGE", "TEXT"]
      };
    }

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
      return new Response(JSON.stringify({ error: 'Upstream API error', details: errorText }), {
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
        rawResponse: responseData,
        responseText: responseText
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
    return new Response(JSON.stringify({ error: 'An internal server error occurred.', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
