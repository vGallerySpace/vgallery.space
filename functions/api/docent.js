export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const prompt = body.prompt || "";

    const systemInstruction = `You are RESA, the Virtual Docent for vGallerySpace by FRAMOUS.
Speak with quiet curatorial confidence—art-literate, direct, concise, articulate, and thoughtful.
Never use robotic sycophantic filler ("Great question!", "I'd be happy to help").
Never repeat "Welcome to vGallerySpace" or "I am RESA" during ongoing turns.
Answer questions directly, offering deep insights into exhibitions, physical architectural sculpture prototypes (like Prototype No. 7 in the STUDIO under arch>scul prototypes), codes.gallery, and historical archives in the OFFICE.`;

    const apiKey = context.env ? context.env.GEMINI_API_KEY : "";

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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
