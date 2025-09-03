// Cloudflare Pages Function: /api/generate
// This function now correctly uses the /v1/chat/completions endpoint for image generation,
// as confirmed by successful tests with the CherryStudio client.
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

    // ALWAYS use the Chat Completions format.
    const forwardBody = {
      model: body.model || 'vertexpic-gemini-2.5-flash-image-preview', // This model name seems correct for the chat endpoint
      messages: [{
        role: "user",
        content: body.prompt
      }]
    };

    // ALWAYS use the /v1/chat/completions endpoint.
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

    // --- FINAL, CORRECTED Data Transformation for Chat API ---
    let imageUrl = null;

    if (responseData.choices && Array.isArray(responseData.choices) && responseData.choices.length > 0) {
      const choice = responseData.choices;
      if (choice && choice.message && typeof choice.message.content === 'string') {
        const content = choice.message.content;
        const dataUriMatch = content.match(/data:image\/[a-zA-Z]+;base64,[^"'\s]+/);
        if (dataUriMatch && dataUriMatch.length > 0) {
          imageUrl = dataUriMatch;
        }
      }
    }

    if (!imageUrl) {
      console.error('FINAL ATTEMPT FAILED: Could not extract Base64 data URI from the chat response:', JSON.stringify(responseData, null, 2));
      // Return the full, raw response data to the frontend for debugging.
      return new Response(JSON.stringify({
        error: 'The chat API response did not contain a recognizable image data string.',
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
    console.error('Error in Pages Function:', err);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
