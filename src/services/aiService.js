import OpenAI from 'openai';
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function compareProducts(query, products) {
  // تحويل بيانات المنتجات إلى نص لإرسالها مع الـ prompt
  const productsData = products
    .map(p => `Product:${p.name},id:${p.id},image:${p.image},Price:$${p.price},Brand:${p.brand},`)
    .join('');

  // إنشاء الـ prompt
  const prompt = `
You are a smart assistant. Your ONLY job is to select the two most relevant products from the data below, and return them as a pure JSON array (no explanation, no text, no comments, no newlines, no markdown, no tags).

Here is the data about the available products: ${productsData}

The user said: "${query}"

Return ONLY a JSON array of the two selected products, using the exact same fields as in the data above. Do NOT add any explanation, text, or extra fields. Do NOT add newlines, slashes, or markdown. Just the array.

Example output:
[
  { "id": "...", "name": "...", "image": "...", "price": ..., "description": "...", "brand": "...", "category": "...", "discount": ... },
  { "id": "...", "name": "...", "image": "...", "price": ..., "description": "...", "brand": "...", "category": "...", "discount": ... }
]
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // استخدم gpt-3.5-turbo لأنه أرخص، أو gpt-4 لو عندك إمكانية
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: "Please provide the comparison." },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}