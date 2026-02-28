import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/stock', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, unit, current_quantity, created_at FROM materials ORDER BY name'
  );
  return res.json(rows);
});

router.get('/transactions', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT st.id, st.txn_type, m.name as material_name, st.quantity_change, st.reference_type,
            st.reference_id, st.notes, st.created_at
     FROM stock_transactions st
     JOIN materials m ON m.id = st.material_id
     ORDER BY st.created_at DESC`
  );
  return res.json(rows);
});

export default router;
