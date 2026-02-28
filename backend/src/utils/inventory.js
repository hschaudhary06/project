export function buildConsumptionPlan(recipeRows, soldQuantity) {
  if (soldQuantity <= 0) {
    throw new Error('Sold quantity must be greater than zero');
  }

  return recipeRows.map((row) => ({
    materialId: row.material_id,
    materialName: row.material_name,
    requiredQuantity: Number(row.quantity_per_unit) * Number(soldQuantity),
    availableQuantity: Number(row.current_quantity),
  }));
}

export function assertSufficientStock(consumptionPlan) {
  const shortages = consumptionPlan.filter(
    (item) => item.requiredQuantity > item.availableQuantity
  );

  if (shortages.length > 0) {
    const detail = shortages
      .map(
        (s) =>
          `${s.materialName}: required ${s.requiredQuantity}, available ${s.availableQuantity}`
      )
      .join('; ');
    throw new Error(`Insufficient raw material stock -> ${detail}`);
  }
}
