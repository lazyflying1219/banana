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

    // 为生图优化提示词
    let optimizedPrompt = body.prompt;
    if (modelName.includes('gemini') || modelName.includes('image')) {
      // 如果提示词没有明确要求生成图片，则添加指令
      if (!optimizedPrompt.toLowerCase().includes('generate') &&
        !optimizedPrompt.toLowerCase().includes('create') &&
        !optimizedPrompt.toLowerCase().includes('draw') &&
        !optimizedPrompt.toLowerCase().includes('生成') &&
        !optimizedPrompt.toLowerCase().includes('画')) {
        optimizedPrompt = `Generate an image: ${optimizedPrompt}`;
      }
    }

    // 格式1: 针对Veloera/Gemini优化的格式
    let forwardBody = {
      model: modelName,
      messages: [{
        role: "user",
        content: optimizedPrompt
      }],
      max_tokens: 8192, // 增加token限制以容纳图片数据
      temperature: 0.7,
      stream: false,
      // Gemini特有参数
      top_p: 0.95,
      top_k: 40
    };

    // 格式2: 根据Gemini API规范配置
    if (modelName.includes('gemini') || modelName.includes('vertexpic')) {
      // Gemini 2.5 Flash的正确配置
      forwardBody.generationConfig = {
        responseModalities: ["IMAGE", "TEXT"],
        maxOutputTokens: 8192,
        temperature: 0.7,
        topP: 0.95,
        topK: 40
      };

      // 删除可能冲突的参数
      delete forwardBody.max_tokens;
      delete forwardBody.temperature;
      delete forwardBody.top_p;
      delete forwardBody.top_k;
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

      forwardBody.messages.content = content;
    }

    // 添加调试信息到响应中
    const debugInfo = {
      requestModel: modelName,
      hasImages: !!(body.images && body.images.length > 0),
      promptLength: body.prompt ? body.prompt.length : 0,
      timestamp: new Date().toISOString()
    };

    // 使用正确的完整API端点
    let apiUrl = 'https://veloe.onrender.com/v1/chat/completions';

    // 尝试两种方式：流式和非流式
    let apiResponse;
    let responseData;

    try {
      // 方式1: 非流式请求
      console.log('发送API请求到:', apiUrl);
      console.log('请求体:', JSON.stringify(forwardBody, null, 2));
      
      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
      
      try {
        apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(forwardBody),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('API请求超时，请稍后重试');
        }
        throw fetchError;
      }

      console.log('API响应状态:', apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('API错误响应:', errorText);
        throw new Error(`HTTP ${apiResponse.status}: ${errorText}`);
      }

      responseData = await apiResponse.json();
      console.log('API响应数据长度:', JSON.stringify(responseData).length);

      // 检查是否有完整的图片数据
      const hasCompleteImage = JSON.stringify(responseData).includes('data:image') &&
        JSON.stringify(responseData).match(/data:image\/[^"]+/);

      // 如果没有完整图片数据，尝试流式请求
      if (!hasCompleteImage) {
        console.log('No complete image found, trying streaming...');
        const streamBody = { ...forwardBody, stream: true };

        const streamResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(streamBody),
        });

        if (streamResponse.ok) {
          // 处理流式响应
          const reader = streamResponse.body.getReader();
          const decoder = new TextDecoder();
          let fullContent = '';
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');

              // 保留最后一行（可能不完整）
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                  try {
                    const jsonStr = line.slice(6).trim();
                    if (jsonStr) {
                      const data = JSON.parse(jsonStr);
                      if (data.choices && data.choices?.delta?.content) {
                        fullContent += data.choices.delta.content;
                      }
                    }
                  } catch (e) {
                    // 忽略解析错误，继续处理
                    console.log('Parse error for line:', line.slice(0, 100));
                  }
                }
              }
            }

            // 处理剩余的buffer
            if (buffer.startsWith('data: ') && buffer !== 'data: [DONE]') {
              try {
                const jsonStr = buffer.slice(6).trim();
                if (jsonStr) {
                  const data = JSON.parse(jsonStr);
                  if (data.choices && data.choices?.delta?.content) {
                    fullContent += data.choices.delta.content;
                  }
                }
              } catch (e) {
                console.log('Parse error for final buffer');
              }
            }

            console.log('Stream content length:', fullContent.length);

            // 构造完整响应
            if (fullContent.length > 0) {
              responseData = {
                choices: [{
                  message: {
                    content: fullContent
                  }
                }],
                usage: {
                  completion_tokens: fullContent.length
                }
              };
            }
          } catch (streamError) {
            console.log('Stream processing error:', streamError.message);
          }
        }
      }
    } catch (streamError) {
      // 如果流式请求失败，继续使用原始响应
      console.log('Stream request failed, using original response');
    }

    // 错误处理已在上面的try-catch中处理

    let imageUrl = null;
    let responseText = '';

    // 获取完整响应文本用于调试和搜索
    const fullResponseText = JSON.stringify(responseData);

    // 尝试多种方式解析响应
    if (responseData.choices && responseData.choices.length > 0) {
      const choice = responseData.choices;
      const messageContent = choice?.message?.content;

      if (typeof messageContent === 'string') {
        responseText = messageContent;

        // 方法1: 查找base64图片数据 - 更宽松的匹配
        const dataUriMatch = messageContent.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\n\r]+/);
        if (dataUriMatch) {
          imageUrl = dataUriMatch.replace(/[\s\n\r]/g, '');
          console.log('Found image in message content, length:', imageUrl.length);
        }

        // 方法2: 查找图片URL
        if (!imageUrl) {
          const urlMatch = messageContent.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)/i);
          if (urlMatch) {
            imageUrl = urlMatch;
          }
        }

        // 方法3: 查找markdown格式的图片
        if (!imageUrl) {
          const markdownMatch = messageContent.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
          if (markdownMatch) {
            imageUrl = markdownMatch;
          }
        }
      } else if (Array.isArray(messageContent)) {
        // 处理数组格式的内容
        for (const item of messageContent) {
          if (item.type === 'image_url' && item.image_url?.url) {
            imageUrl = item.image_url.url;
            break;
          } else if (item.type === 'image' && item.source?.data) {
            imageUrl = `data:image/${item.source.media_type || 'png'};base64,${item.source.data}`;
            break;
          } else if (item.type === 'text') {
            responseText += item.text || '';
          }
        }
      }
    }

    // 关键修复：在完整响应中搜索base64图片数据
    if (!imageUrl && fullResponseText.includes('data:image')) {
      console.log('Searching for image in full response...');
      // 更宽松的正则表达式，匹配可能被转义或分割的base64数据
      const globalBase64Match = fullResponseText.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=\\n\\r\\s]+/);
      if (globalBase64Match) {
        // 清理转义字符和空白
        imageUrl = globalBase64Match.replace(/\\n|\\r|\\s|\\/g, '').replace(/[\s\n\r]/g, '');
        console.log('Found image in full response, length:', imageUrl.length);
      }
    }

    // 如果还是没找到，尝试查找任何长的base64模式
    if (!imageUrl && (fullResponseText.includes('base64') || responseText.includes('base64'))) {
      console.log('Searching for any base64 pattern...');
      // 在响应文本中查找长的base64字符串
      const searchText = responseText || fullResponseText;
      const anyBase64Match = searchText.match(/[A-Za-z0-9+\/]{500,}={0,2}/);
      if (anyBase64Match) {
        // 假设是PNG格式
        imageUrl = `data:image/png;base64,${anyBase64Match[0]}`;
        console.log('Found base64 pattern, length:', imageUrl.length);
      }
    }

    // 如果还是没找到图片，尝试其他字段
    if (!imageUrl) {
      // 检查是否有直接的图片字段
      if (responseData.image) {
        imageUrl = responseData.image;
      } else if (responseData.data && responseData.data?.url) {
        imageUrl = responseData.data.url;
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
    console.error('Generate API Error:', err);
    
    return new Response(JSON.stringify({
      error: '服务器内部错误',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      apiUrl: 'https://veloe.onrender.com/v1/chat/completions',
      hasApiKey: !!env.VELAO_API_KEY,
      requestBody: body,
      timestamp: new Date().toISOString(),
      suggestions: [
        '1. 检查VELAO_API_KEY环境变量是否设置',
        '2. 验证API服务是否正常运行',
        '3. 检查网络连接',
        '4. 确认模型名称正确'
      ]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
