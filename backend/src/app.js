import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import materialRoutes from './routes/materials.js';
import productRoutes from './routes/products.js';
import reportRoutes from './routes/reports.js';
import { authRequired } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authRequired, dashboardRoutes);
app.use('/api/materials', authRequired, materialRoutes);
app.use('/api/products', authRequired, productRoutes);
app.use('/api/reports', authRequired, reportRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
