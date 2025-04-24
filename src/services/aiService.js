import OpenAI from 'openai';
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function compareProducts(query, products) {
  // تحويل بيانات المنتجات إلى نص لإرسالها مع الـ prompt
  const productsData = products
    .map(p => `Product: ${p.name}, Price: $${p.price}, Brand: ${p.brand}, Features: ${JSON.stringify(p.features)}`)
    .join('.');

  // إنشاء الـ prompt
  const prompt = `
أنت مساعد ذكي متخصص في مقارنة المنتجات باللغة العربية. بناءً على بيانات المنتجات التالية:
${productsData}

استخدم طلب المستخدم التالي: "${query}"

قم بالمهام التالية في ردك:
1. قارن المنتجات المذكورة في الطلب (أو اختر منتجات مناسبة إذا كان الطلب عامًا) بناءً على السعر.
2. انصح بمنتج واحد للشراء بناءً على أفضل قيمة مقابل السعر (وضح ليه هو الأفضل).
3. رشح منتجًا مرتبطًا (مثل إكسسوار أو منتج مكمّل) يكون مناسبًا مع المنتج المنصوح به، واذكر اسمه وسعره إذا كان متاحًا أو وصفه إذا لم يكن في البيانات.
4. %اذكر أنه إذا اشترى المستخدم أكثر من منتجين، سيحصل على خصم 5%.
5. ركز على المقارنة والتوصية فقط، ولا تخرج عن الموضوع.
6.لا اريد جداول ف المقارنه مجرد نص 
7. اريد ان يكون الرد مختصر ومفيد
9.لا تفصل بين الكلام بعلامات زي * او / او علامات مختلفه 

`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // استخدم gpt-3.5-turbo لأنه أرخص، أو gpt-4 لو عندك إمكانية
    messages: [
      { role: 'system', content: 'You are a product comparison expert.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}