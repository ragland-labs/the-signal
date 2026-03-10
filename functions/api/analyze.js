export async function onRequestPost({ request, env }) {
  try {
    const API_KEY = env.GEMINI_API_KEY || env.API_KEY;
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: { message: "API key not configured. Add GEMINI_API_KEY (or API_KEY) to Cloudflare Pages environment variables." } }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { model, contents, system_instruction, generationConfig } = await request.json();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, system_instruction, generationConfig })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
