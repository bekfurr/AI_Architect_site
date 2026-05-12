import { GoogleGenerativeAI } from '@google/genai';

// Note: The newer @google/genai package is used.
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export async function POST(request) {
  try {
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API key is missing." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { idea } = await request.json();

    if (!idea) {
      return new Response(JSON.stringify({ error: "G'oya matni kiritilmadi." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize the client. The new SDK uses new GoogleGenAI().
    // Wait, let's just use REST API to be safe, or stick to what is standard.
    // If we installed @google/genai, it's: import { GoogleGenAI } from '@google/genai';
    // Actually, let's use the standard fetch to generative language API to avoid SDK version issues if possible, 
    // OR just use the installed sdk correctly.
    // In node, it's `import { GoogleGenerativeAI } from '@google/generative-ai'` historically. We installed `@google/genai`.
    // Let's use standard fetch for simplicity and robustness.
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const promptText = `
Sen professional arxitektor va Midjourney/Stable Diffusion uchun "Prompt Engineer"san.
Foydalanuvchi senga qisqacha g'oya beradi. Sen uni kengaytirib, vizual ravishda juda boy, professional va batafsil inglizcha promptga aylantirishing kerak.
Promptda arxitektura uslubi (masalan, brutalizm, modern, biophilic), yorug'lik (cinematic lighting, golden hour), kameralar burchagi (wide angle, aerial view) va materiallar (concrete, glass, wood) haqida ma'lumotlar bo'lishi kerak.

Foydalanuvchi g'oyasi: "${idea}"

Faqat tayyor inglizcha promptni qaytar. Boshqa hech qanday izoh yoki tushuntirish kerak emas.
`;

    const body = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.7,
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

    const generatedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text || "Prompt yaratilmadi.";

    return new Response(JSON.stringify({ prompt: generatedPrompt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Prompt generation error:", error);
    return new Response(JSON.stringify({ error: "Xatolik yuz berdi." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
