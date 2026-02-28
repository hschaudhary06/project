import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ProductionPage() {
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('Battery');
  const [recipe, setRecipe] = useState([{ materialId: '', quantityPerUnit: '' }]);
  const [sellQty, setSellQty] = useState({});

  const load = async () => {
    const [mRes, pRes] = await Promise.all([api.get('/materials'), api.get('/products')]);
    setMaterials(mRes.data);
    setProducts(pRes.data);
  };

  useEffect(() => { load(); }, []);

  function updateRecipe(index, key, value) {
    const next = [...recipe];
    next[index][key] = value;
    setRecipe(next);
  }

  async function createProduct(e) {
    e.preventDefault();
    await api.post('/products', {
      name,
      recipe: recipe.map((r) => ({ materialId: Number(r.materialId), quantityPerUnit: Number(r.quantityPerUnit) })),
    });
    setName('');
    setRecipe([{ materialId: '', quantityPerUnit: '' }]);
    load();
  }

  async function sellProduct(id) {
    await api.post(`/products/${id}/sell`, { quantity: Number(sellQty[id] || 0) });
    setSellQty((prev) => ({ ...prev, [id]: '' }));
    load();
  }

  return (
    <div>
      <h2>Production & Sales</h2>
      <form onSubmit={createProduct} style={{ marginBottom: 20 }}>
        <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
        {recipe.map((r, idx) => (
          <div key={idx}>
            <select value={r.materialId} onChange={(e) => updateRecipe(idx, 'materialId', e.target.value)}>
              <option value="">Select material</option>
              {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input type="number" placeholder="Qty used per product" value={r.quantityPerUnit} onChange={(e) => updateRecipe(idx, 'quantityPerUnit', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={() => setRecipe((prev) => [...prev, { materialId: '', quantityPerUnit: '' }])}>+ Add Recipe Material</button>
        <button type="submit">Create Product</button>
      </form>

      <h3>Sell Product</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Name</th><th>Recipe Count</th><th>Sell Qty</th><th>Action</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.recipe?.length || 0}</td>
              <td><input type="number" value={sellQty[p.id] || ''} onChange={(e) => setSellQty((prev) => ({ ...prev, [p.id]: e.target.value }))} /></td>
              <td><button onClick={() => sellProduct(p.id)}>Sell</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
