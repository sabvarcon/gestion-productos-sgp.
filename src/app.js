import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'gestion-productos-sgp' }));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../public/login.html')));

app.use(notFound);
app.use(errorHandler);

export default app;
