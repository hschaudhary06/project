import { useEffect, useState } from 'react';
import api from '../api/client';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [initialQuantity, setInitialQuantity] = useState(0);
  const [purchaseQty, setPurchaseQty] = useState({});

  const load = () => api.get('/materials').then((res) => setMaterials(res.data));
  useEffect(() => { load(); }, []);

  async function addMaterial(e) {
    e.preventDefault();
    await api.post('/materials', { name, unit, initialQuantity: Number(initialQuantity) });
    setName('');
    setInitialQuantity(0);
    load();
  }

  async function purchase(id) {
    await api.post(`/materials/${id}/purchase`, { quantity: Number(purchaseQty[id] || 0) });
    setPurchaseQty((prev) => ({ ...prev, [id]: '' }));
    load();
  }

  return (
    <div>
      <h2>Raw Materials</h2>
      <form onSubmit={addMaterial} style={{ marginBottom: 16 }}>
        <input placeholder="Material name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <input type="number" placeholder="Initial qty" value={initialQuantity} onChange={(e) => setInitialQuantity(e.target.value)} />
        <button type="submit">Add Material</button>
      </form>

      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Name</th><th>Unit</th><th>Qty</th><th>Purchase Add Qty</th><th>Action</th></tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td><td>{m.unit}</td><td>{m.current_quantity}</td>
              <td><input type="number" value={purchaseQty[m.id] || ''} onChange={(e) => setPurchaseQty((prev) => ({ ...prev, [m.id]: e.target.value }))} /></td>
              <td><button onClick={() => purchase(m.id)}>Add Purchase</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
