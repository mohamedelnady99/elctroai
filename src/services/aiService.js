import OpenAI from 'openai';
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function compareProducts(query, products) {
  // تحويل بيانات المنتجات إلى نص لإرسالها مع الـ prompt
  const productsData = products
    .map(p => `Product: ${p.name},id:${p.id},image:${p.image},Price: $${p.price}, Brand: ${p.brand}, Features: ${JSON.stringify(p.features)}`)
    .join('.');

  // إنشاء الـ prompt
  const prompt = `
 You are a smart assistant that analyzes what the user said in order to help them compare products.

Here is the data about the available products:${productsData}


The user said: "${query}"
Compare the following two products based on their brand, category, and price. Provide a recommendation on which product offers better value for money. Return the response in JSON format only, with fields for 'comparison' (containing product details and analysis) and 'recommendation' (indicating the better product and reason).
Products:
[
1. {product1['name']},id{product1['id']},image{product1['image']},brand: {product1['brand']}, category: {product1['category']}, price: {product1['price']}.
2. {product2['name']},id{product2['id']},image{product2['image']},brand: {product2['brand']}, category: {product2['category']}, price: {product2['price']}.
]
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // استخدم gpt-3.5-turbo لأنه أرخص، أو gpt-4 لو عندك إمكانية
    messages: [
      { role: 'system', content: prompt  },
      { role: 'user', content: "Please provide the comparison." },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}