// Cloudflare Pages Function: /api/generate
// FINAL, CORRECTED version. This function now uses the chat completions endpoint 
// with a specific tool definition to reliably trigger image generation.
export async function onRequest(context) {
  const { request, env } = context;

  // Build flexible CORS headers (optionally restricted by env.ALLOWED_ORIGINS)
  const buildCorsHeaders = () => {
    const origin = request.headers.get('Origin') || '';
    const allowList = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    let allowOrigin = '*';
    if (allowList.length > 0 && !allowList.includes('*')) {
      // Match exact origin entries; if only domains are provided, allow exact scheme+host match
      if (origin && allowList.includes(origin)) {
        allowOrigin = origin;
      } else {
        // Fallback to first configured origin to avoid wildcard
        allowOrigin = allowList[0];
      }
    }
    return {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: buildCorsHeaders(),
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body = null;
  try {
    body = await request.json();
    const apiKey = env.VELAO_API_KEY;

    if (!apiKey) {
      const placeholderUrl = `https://placehold.co/1024x1024/000000/FFFFFF/png?text=API%20Key%20Not%20Set\\n${encodeURIComponent(body.prompt)}`;
      return new Response(JSON.stringify({ src: placeholderUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders() },
      });
    }

    // 尝试多种API格式，模拟CherryStudio的请求方式
    const modelName = body.model || 'vertexpic2-gemini-2.5-flash-image-preview';

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

    // 从前端接收的aspectRatio参数
    const aspectRatio = body.aspectRatio || '16:9';
    
    // 添加详细的aspectRatio调试日志
    console.log('=== Aspect Ratio Debug Info ===');
    console.log('Received aspectRatio from frontend:', body.aspectRatio);
    console.log('Final aspectRatio to use:', aspectRatio);
    console.log('Model name:', modelName);
    console.log('Model includes gemini:', modelName.includes('gemini'));
    console.log('Model includes vertexpic:', modelName.includes('vertexpic'));

    // 格式1: 针对Veloera/Gemini优化的格式
    let forwardBody = {
      model: modelName,
      messages: [{
        role: "user",
        content: optimizedPrompt
      }],
      max_tokens: 8192, // 增加token限制以容纳图片数据
      temperature: 0.7,
      stream: true,
      // Gemini特有参数
      top_p: 0.95,
      top_k: 40
    };

    // 格式2: 根据Gemini API规范配置
    if (modelName.includes('gemini') || modelName.includes('vertexpic')) {
      console.log('Setting generation_config for Gemini model');
      // Gemini 2.5 Flash的正确配置，包含aspect_ratio参数
      forwardBody.generation_config = {
        thinkingConfig: null,
        responseModalities: ["TEXT", "IMAGE"],
        image_config: {
          aspect_ratio: aspectRatio
        }
      };
      
      console.log('generation_config set:', JSON.stringify(forwardBody.generation_config, null, 2));

      // 删除可能冲突的参数
      delete forwardBody.max_tokens;
      delete forwardBody.temperature;
      delete forwardBody.top_p;
      delete forwardBody.top_k;
    } else {
      console.log('Model does not match Gemini/vertexpic pattern, generation_config not set');
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

    // 将调试信息添加到响应中，以便前端可以看到
    debugInfo.aspectRatioDebug = {
      receivedFromFrontend: body.aspectRatio,
      finalAspectRatio: aspectRatio,
      modelName: modelName,
      modelMatchesGemini: modelName.includes('gemini'),
      modelMatchesVertexpic: modelName.includes('vertexpic'),
      generationConfigSet: !!(forwardBody.generation_config),
      imageConfigSet: !!(forwardBody.generation_config && forwardBody.generation_config.image_config),
      aspectRatioSet: !!(forwardBody.generation_config && forwardBody.generation_config.image_config && forwardBody.generation_config.image_config.aspect_ratio),
      finalGenerationConfig: forwardBody.generation_config || null,
      forwardBody: forwardBody // 添加完整的 forwardBody 以便调试
    };

    // 使用正确的完整API端点
    let apiUrl = 'https://veloe.onrender.com/v1/chat/completions';

    console.log('发送流式API请求到:', apiUrl);
    console.log('完整请求体:', JSON.stringify(forwardBody, null, 2));
    console.log('=== 关键参数检查 ===');
    console.log('aspectRatio 参数值:', aspectRatio);
    console.log('generation_config 是否存在:', !!forwardBody.generation_config);
    console.log('image_config 是否存在:', !!(forwardBody.generation_config && forwardBody.generation_config.image_config));
    console.log('aspect_ratio 是否设置:', !!(forwardBody.generation_config && forwardBody.generation_config.image_config && forwardBody.generation_config.image_config.aspect_ratio));
    if (forwardBody.generation_config && forwardBody.generation_config.image_config) {
      console.log('实际的 aspect_ratio 值:', forwardBody.generation_config.image_config.aspect_ratio);
    }
    
    // 优化超时控制 - 45秒超时，适合图片生成
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45秒超时
    
    let apiResponse;
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
        throw new Error('API请求超时（45秒），请检查网络或稍后重试');
      }
      throw fetchError;
    }

    console.log('===== API响应详情 =====');
    console.log('状态码:', apiResponse.status);
    console.log('状态文本:', apiResponse.statusText);
    console.log('响应头:', JSON.stringify([...apiResponse.headers.entries()], null, 2));

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('===== API错误详情 =====');
      console.error('状态码:', apiResponse.status);
      console.error('状态文本:', apiResponse.statusText);
      console.error('错误响应体:', errorText);
      console.error('请求URL:', apiUrl);
      console.error('请求模型:', modelName);
      console.error('请求比例:', aspectRatio);
      console.error('提示词长度:', optimizedPrompt.length);
      console.error('提示词前100字符:', optimizedPrompt.substring(0, 100));
      console.error('是否包含图片:', !!(body.images && body.images.length > 0));
      console.error('图片数量:', body.images ? body.images.length : 0);
      
      // 尝试解析错误信息
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
        console.error('解析后的错误:', JSON.stringify(parsedError, null, 2));
      } catch (e) {
        console.error('无法解析错误JSON,原始错误文本:', errorText);
      }
      
      throw new Error(`HTTP ${apiResponse.status}: ${errorText}`);
    }

    // 优化的流式响应处理 - 早期中断机制
    const reader = apiResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';
    let imageFound = false;
    let responseData;

    try {
      // 设置流读取的最大时间为30秒
      const streamTimeout = setTimeout(() => {
        console.log('Stream reading timeout after 30s, stopping...');
        reader.cancel();
      }, 30000);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          clearTimeout(streamTimeout);
          break;
        }

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
                if (data.choices && data.choices[0]?.delta?.content) {
                  const content = data.choices[0].delta.content;
                  fullContent += content;
                  
                  // 关键优化：一旦检测到图片数据，立即标记并准备中断
                  if (content.includes('data:image') && !imageFound) {
                    imageFound = true;
                    console.log('Image data detected! Starting early termination...');
                    
                    // 继续读取一小段时间以确保图片数据完整（1秒）
                    setTimeout(() => {
                      clearTimeout(streamTimeout);
                      reader.cancel().catch(() => {});
                    }, 1000);
                  }
                }
              }
            } catch (e) {
              // 忽略解析错误，继续处理
              console.log('Parse error for line:', line.slice(0, 100));
            }
          }
        }

        // 如果已找到图片且读取了足够数据，可以提前结束
        if (imageFound && fullContent.length > 50000) {
          clearTimeout(streamTimeout);
          console.log('Image found and sufficient data collected, ending stream early');
          reader.cancel().catch(() => {});
          break;
        }
      }

      // 处理剩余的buffer
      if (buffer.startsWith('data: ') && buffer !== 'data: [DONE]') {
        try {
          const jsonStr = buffer.slice(6).trim();
          if (jsonStr) {
            const data = JSON.parse(jsonStr);
            if (data.choices && data.choices[0]?.delta?.content) {
              const content = data.choices[0].delta.content;
              fullContent += content;
              
              if (content.includes('data:image')) {
                imageFound = true;
                console.log('Image data detected in final buffer');
              }
            }
          }
        } catch (e) {
          console.log('Parse error for final buffer');
        }
      }

      console.log('Stream content length:', fullContent.length);
      console.log('Image found in stream:', imageFound);

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
          },
          _streamImageFound: imageFound
        };
      }
    } catch (streamError) {
      console.log('Stream processing error:', streamError.message);
      throw streamError;
    }

    let imageUrl = null;
    let responseText = '';

    // 获取完整响应文本用于调试和搜索
    const fullResponseText = JSON.stringify(responseData);
    console.log('Response has stream image marker:', responseData._streamImageFound);

    // 尝试多种方式解析响应
    if (responseData.choices && responseData.choices.length > 0) {
      const choice = responseData.choices[0];
      const messageContent = choice?.message?.content;

      if (typeof messageContent === 'string') {
        responseText = messageContent;

        // 方法1: 查找base64图片数据 - 更宽松的匹配
        const dataUriMatch = messageContent.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s\n\r]+/);
        if (dataUriMatch) {
          imageUrl = dataUriMatch[0].replace(/[\s\n\r]/g, '');
          console.log('Found image in message content, length:', imageUrl.length);
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
        imageUrl = globalBase64Match[0].replace(/\\n|\\r|\\s|\\/g, '').replace(/[\s\n\r]/g, '');
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

    // Prepare optional text (remove embedded base64 image payloads for readability)
    let textOnly = responseText;
    if (textOnly && typeof textOnly === 'string') {
      try {
        textOnly = textOnly.replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=\n\r\s]+/g, '').trim();
      } catch (_) {}
    }

    const frontendResponse = {
      src: imageUrl,
      text: textOnly,
      debugInfo: debugInfo, // 添加调试信息到响应中
    };

    return new Response(JSON.stringify(frontendResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders() },
    });

  } catch (err) {
    console.error('Generate API Error:', err);
    
    return new Response(JSON.stringify({
      error: '服务器内部错误',
      details: err.message,
      // Cloudflare Workers do not expose process.env; guard usage
      stack: (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ? err.stack : undefined,
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
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders() },
    });
  }
}
