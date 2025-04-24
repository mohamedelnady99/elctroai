import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', productRoutes);

app.get('/', (req, res) => {
  res.send('tamaam');
});

app.listen(port, () => {
  console.log(` server runing   http://localhost:${port}`);
});
