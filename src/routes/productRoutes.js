// import express from 'express';
// import { compareProducts } from '../services/aiService.js';
// import products from '../../data/products.json' assert { type: 'json' };

// const router = express.Router();

// router.post('/compare', async (req, res) => {
//   const { query } = req.body; // النص الحر من البحث الصوتي

//   if (!query) {
//     return res.status(400).json({ error: 'يرجى إدخال نص البحث' });
//   }

//   try {
//     const comparison = await compareProducts(query, products);
//     res.json({ comparison });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'حدث خطأ أثناء المقارنة' });
//   }
// });

// export default router;


import express from 'express';
import { compareProducts } from '../services/aiService.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, '../../data/products.json');

const products = JSON.parse(await readFile(productsPath, 'utf8'));

const router = express.Router();



router.post('/compare', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'يرجى إدخال نص البحث' });
  }

  try {
    const aiResponse = await compareProducts(query, products);
    let aiResponseClean = aiResponse.trim();
    // أزل أي أسطر جديدة أو مسافات زائدة
    aiResponseClean = aiResponseClean.replace(/(\r\n|\n|\r)/gm, "");
    // أزل أي نص قبل أو بعد الـ array (لو حصل)
    const firstBracket = aiResponseClean.indexOf('[');
    const lastBracket = aiResponseClean.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      aiResponseClean = aiResponseClean.substring(firstBracket, lastBracket + 1);
    }
    let comparison;
    try {
      comparison = JSON.parse(aiResponseClean);
    } catch (e) {
      return res.status(500).json({ error: 'AI response is not valid JSON', raw: aiResponse });
    }
    res.json({ comparison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء المقارنة' });
  }
});
// ... existing code ...
export default router;