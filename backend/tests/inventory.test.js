import test from 'node:test';
import assert from 'node:assert/strict';
import { assertSufficientStock, buildConsumptionPlan } from '../src/utils/inventory.js';

test('buildConsumptionPlan calculates required quantities', () => {
  const recipe = [{ material_id: 1, material_name: 'Lead', quantity_per_unit: 2, current_quantity: 50 }];
  const plan = buildConsumptionPlan(recipe, 5);
  assert.equal(plan[0].requiredQuantity, 10);
});

test('assertSufficientStock throws on shortage', () => {
  const plan = [{ materialId: 1, materialName: 'Acid', requiredQuantity: 12, availableQuantity: 10 }];
  assert.throws(() => assertSufficientStock(plan), /Insufficient raw material stock/);
});

test('assertSufficientStock passes when stock is enough', () => {
  const plan = [{ materialId: 1, materialName: 'Plastic', requiredQuantity: 3, availableQuantity: 10 }];
  assert.doesNotThrow(() => assertSufficientStock(plan));
});
