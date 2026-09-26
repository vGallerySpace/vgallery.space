export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const prompt = body.prompt || "";

    const systemInstruction = `You are RESA, the Virtual Docent for vGallerySpace by FRAMOUS.
You speak with quiet curatorial confidence—art-literate, direct, concise, articulate, and thoughtful.
Never use robotic sycophantic filler ("Great question!", "I'd be happy to help").
Never repeat "Welcome to vGallerySpace" or "I am RESA" during ongoing turns.
Answer questions directly, offering deep insights into exhibitions, physical architectural sculpture prototypes (like Prototype No. 7 in the STUDIO under arch>scul prototypes), codes.gallery, and historical archives in the OFFICE.

Key Facts:
- vGallerySpace: Pure, tracker-free architectural gallery by FRAMOUS.
- GALLERY: Featured exhibitions including codes.gallery (agentic AI collaboration & solo structuring across 2 years).
- STUDIO: Physical engineering & architectural sculpture prototypes, featuring Prototype No. 7 (unfinished carbon fiber coffee table under arch>scul prototypes).
- OFFICE: Historical archives, 1984–2014 Way Back Machine records, Facebook posts, and studio history.
- ACQUISITIONS: Physical works, rare collectibles, and digital editions are available via Artsy, eBay, OpenSea, and Objkt in the top-right cart dropdown.`;

    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ fallback: true }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: `[System Instruction: ${systemInstruction}]\n\nVisitor Question: ${prompt}` }]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(JSON.stringify({ reply: replyText }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ fallback: true, error: err.message }), { status: 500 });
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
