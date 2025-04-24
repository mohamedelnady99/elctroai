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
    const comparison = await compareProducts(query, products);
    res.json({ comparison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء المقارنة' });
  }
});

export default router;