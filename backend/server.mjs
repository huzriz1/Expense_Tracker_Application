import 'dotenv/config';
import dns from 'dns';
import express from 'express';
import connectDB from './controllers/connectDB.mjs';
import categoryRouter from './routers/categoryRouter.mjs';
import transactionRouter from './routers/transactionRouter.mjs';
import budgetRouter from './routers/budgetRouter.mjs';
import cors from 'cors';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || null,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api')) return next();

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection failed before API request:', error.message || error);
    return res.status(503).json({
      message: 'Database unavailable',
      error: error.message || 'Unknown database error'
    });
  }
});

app.use('/api/category', categoryRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/budget', budgetRouter);

app.get('/', (req, res) => {
  res.send({ name: 'Huzaifa', age: 19 });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
}
