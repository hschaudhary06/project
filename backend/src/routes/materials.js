import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM materials ORDER BY name');
  return res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, unit, initialQuantity = 0 } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ message: 'name and unit are required' });
  }

  await pool.query(
    'INSERT INTO materials (name, unit, current_quantity) VALUES (?, ?, ?)',
    [name, unit, Number(initialQuantity)]
  );

  return res.status(201).json({ message: 'Material added' });
});

router.post('/:id/purchase', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const amount = Number(quantity);

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'quantity must be > 0' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query('SELECT * FROM materials WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Material not found' });
    }

    await connection.query('UPDATE materials SET current_quantity = current_quantity + ? WHERE id = ?', [amount, id]);

    await connection.query(
      `INSERT INTO stock_transactions
      (txn_type, material_id, quantity_change, reference_type, reference_id, notes)
      VALUES ('PURCHASE', ?, ?, 'MATERIAL_PURCHASE', NULL, ?)` ,
      [id, amount, 'Material purchase']
    );

    await connection.commit();
    return res.json({ message: 'Purchase stock updated' });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

export default router;
