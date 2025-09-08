export async function onRequest(context) {
    const {
        request,
        env,
        params,
        waitUntil,
        next,
        data,
    } = context;

    try {
        if (request.method !== 'POST') {
            return new Response('只接受POST请求', { status: 405 });
        }

        const body = await request.json();
        console.log('Backend received body:', body);
        const model = `gcp-asia-east1/${body.model || 'vertexpic-gemini-2.5-flash-image-preview'}`;
        const prompt = body.prompt;

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt是必需的' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const forwardBody = {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        };

        // --- 核心修改逻辑 ---
        // 前端已将所有图片（内容图+画布图）处理为Data URL并放入images数组
        const hasImages = body.images && body.images.length > 0;

        if (hasImages) {
            const content = [{ type: "text", text: prompt }];

            // 直接遍历前端发送的images数组，并构建多模态消息
            body.images.forEach((imageData, index) => {
                content.push({
                    type: "image_url",
                    image_url: {
                        url: imageData // images已经是Base64 Data URL
                    }
                });
                console.log(`已添加第 ${index + 1} 张图片到请求中。`);
            });
            
            // 将原来的纯文本 content 替换为多模态的 content 数组
            forwardBody.messages.content = content;
            console.log(`已构建包含 ${body.images.length} 张图片的多模态消息。`);
        }
        // --- 修改逻辑结束 ---

        const apiResponse = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': `Cloudflare-AI-Proxy`,
                'HTTP-Referer': `https://workers.cloudflare.com/`,
            },
            body: JSON.stringify({
                "model": model,
                ...forwardBody
            }),
        });

        const responseData = await apiResponse.json();

        if (responseData.error) {
            return new Response(JSON.stringify(responseData), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const imageUrl = responseData.choices.message.content;
        const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        
        return new Response(JSON.stringify({ src: proxiedUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('API 错误:', err.stack);
        return new Response(JSON.stringify({ error: '服务器内部错误', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}