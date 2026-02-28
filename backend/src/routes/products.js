import { Router } from 'express';
import { pool } from '../config/db.js';
import { assertSufficientStock, buildConsumptionPlan } from '../utils/inventory.js';

const router = Router();

router.get('/', async (_req, res) => {
  const [products] = await pool.query('SELECT * FROM products ORDER BY name');
  for (const p of products) {
    const [recipe] = await pool.query(
      `SELECT pr.material_id, m.name as material_name, m.unit, pr.quantity_per_unit
       FROM product_recipes pr
       JOIN materials m ON m.id = pr.material_id
       WHERE pr.product_id = ?`,
      [p.id]
    );
    p.recipe = recipe;
  }
  return res.json(products);
});

router.post('/', async (req, res) => {
  const { name, recipe } = req.body;
  if (!name || !Array.isArray(recipe) || recipe.length === 0) {
    return res.status(400).json({ message: 'name and non-empty recipe are required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query('INSERT INTO products (name) VALUES (?)', [name]);
    const productId = result.insertId;

    for (const item of recipe) {
      await connection.query(
        'INSERT INTO product_recipes (product_id, material_id, quantity_per_unit) VALUES (?, ?, ?)',
        [productId, item.materialId, item.quantityPerUnit]
      );
    }

    await connection.commit();
    return res.status(201).json({ message: 'Product and recipe created' });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

router.post('/:id/sell', async (req, res) => {
  const productId = Number(req.params.id);
  const soldQuantity = Number(req.body.quantity);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (!products.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    const [recipeRows] = await connection.query(
      `SELECT pr.material_id, m.name as material_name, m.current_quantity, pr.quantity_per_unit
       FROM product_recipes pr
       JOIN materials m ON m.id = pr.material_id
       WHERE pr.product_id = ?
       FOR UPDATE`,
      [productId]
    );

    const plan = buildConsumptionPlan(recipeRows, soldQuantity);
    assertSufficientStock(plan);

    const [saleResult] = await connection.query(
      'INSERT INTO product_sales (product_id, sold_quantity) VALUES (?, ?)',
      [productId, soldQuantity]
    );

    for (const item of plan) {
      await connection.query(
        'UPDATE materials SET current_quantity = current_quantity - ? WHERE id = ?',
        [item.requiredQuantity, item.materialId]
      );
      await connection.query(
        `INSERT INTO stock_transactions
        (txn_type, material_id, quantity_change, reference_type, reference_id, notes)
        VALUES ('SALE_CONSUMPTION', ?, ?, 'PRODUCT_SALE', ?, ?)`,
        [item.materialId, -item.requiredQuantity, saleResult.insertId, `Consumed by product sale #${saleResult.insertId}`]
      );
    }

    await connection.commit();
    return res.json({ message: 'Product sold and raw materials consumed', consumption: plan });
  } catch (error) {
    await connection.rollback();
    return res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
});

export default router;
