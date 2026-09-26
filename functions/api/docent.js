export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/docent") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          }
        });
      }
      if (request.method === "POST") {
        try {
          const body = await request.json();
          const prompt = body.prompt || "";

          const systemInstruction = `You are RESA, the Virtual Docent for vGallerySpace by FRAMOUS.
You possess deep, high-level reasoning and articulate curatorial intelligence.
Speak with quiet curatorial confidence—art-literate, direct, concise, articulate, and thoughtful.
Never use robotic sycophantic filler ("Great question!", "I'd be happy to help").
Never repeat "Welcome to vGallerySpace" or "I am RESA" during ongoing turns.
Synthesize deep connections between physical sculpture, digital architecture, and 30 years of studio practice.`;

          const apiKey = env ? env.GEMINI_API_KEY : "";

          if (!apiKey) {
            return new Response(JSON.stringify({ fallback: true }), {
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
          }

          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `[System Instruction: ${systemInstruction}]\n\nVisitor Question: ${prompt}` }] }],
              generationConfig: { temperature: 0.85, topP: 0.95, maxOutputTokens: 350 }
            })
          });

          const data = await res.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          return new Response(JSON.stringify({ reply: replyText }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ fallback: true }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
      }
    }
    // Fallback to static assets
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found", { status: 404 });
  }
};
