import 'dotenv/config'; // load .env at startup
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

// Ensure a cached DB connection is established (safe for serverless)
await connectDB();

// Configure CORS to allow credentials and origins from env or common dev URLs
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || null, // set explicitly if needed
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser (server-to-server) requests with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    // fallback: allow all in development
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// All API routes are prefixed with /api
app.use('/api/category', categoryRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/budget', budgetRouter);

app.get('/', (req, res) => {
  res.send({ name: 'Huzaifa', age: 19 });
});

// Export the app for serverless adapters / testing
export default app;

// Only bind to a port when running locally (not in Vercel serverless runtime)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
}
