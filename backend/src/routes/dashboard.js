import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/summary', async (_req, res) => {
  const [[materialCount]] = await pool.query('SELECT COUNT(*) as total FROM materials');
  const [[productCount]] = await pool.query('SELECT COUNT(*) as total FROM products');
  const [[stockSum]] = await pool.query('SELECT COALESCE(SUM(current_quantity),0) as total FROM materials');

  const [materials] = await pool.query(
    'SELECT id, name, unit, current_quantity FROM materials ORDER BY name ASC'
  );

  return res.json({
    metrics: {
      totalMaterials: materialCount.total,
      totalProducts: productCount.total,
      totalRawStock: Number(stockSum.total),
    },
    materials,
  });
});

export default router;
