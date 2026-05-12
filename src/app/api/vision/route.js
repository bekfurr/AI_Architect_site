export const maxDuration = 60; // Allow 60 seconds for Gemini response

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export async function POST(request) {
  try {
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API key is missing." }), { status: 500 });
    }

    const formData = await request.formData();
    const image = formData.get('image');
    const promptText = formData.get('prompt') || "Bu chizmani arxitektor sifatida tahlil qil. Xatolarni, yaxshilanishi kerak bo'lgan joylarni va material bo'yicha maslahatlarni ber. O'zbek tilida yoz.";

    if (!image) {
      return new Response(JSON.stringify({ error: "Rasm yuklanmadi." }), { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString('base64');
    const mimeType = image.type || 'image/jpeg';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [{
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tahlil natijasi olinmadi.";

    return new Response(JSON.stringify({ analysis }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Vision API error:", error);
    return new Response(JSON.stringify({ error: "Xatolik yuz berdi: " + error.message }), { status: 500 });
  }
}
