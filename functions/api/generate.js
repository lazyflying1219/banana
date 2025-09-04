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

    // FINAL, CORRECTED request body. The API requires BOTH 'messages' and 'generationConfig'.
    const forwardBody = {
      model: body.model || 'vertexpic-gemini-2.5-flash-image-preview',
      messages: [{
        role: "user",
        content: body.prompt
      }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"]
      }
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
      return new Response(JSON.stringify({ error: 'Upstream API error', details: errorText }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const responseData = await apiResponse.json();

    let imageUrl = null;

    if (responseData.choices && responseData.choices.length > 0) {
      const messageContent = responseData.choices[0]?.message?.content;
      if (messageContent) {
        const dataUriMatch = messageContent.match(/data:image\/[a-zA-Z]+;base64,[^"'\s]+/);
        if (dataUriMatch) {
          imageUrl = dataUriMatch[0];
        }
      }
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({ 
        error: 'The API response did not contain a recognizable image data string.',
        rawResponse: responseData 
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
