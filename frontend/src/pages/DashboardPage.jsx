import { useEffect, useState } from 'react';
import api from '../api/client';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Materials: {data.metrics.totalMaterials}</p>
      <p>Total Products: {data.metrics.totalProducts}</p>
      <p>Total Raw Stock: {data.metrics.totalRawStock}</p>

      <h3>Current Stock</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Name</th><th>Unit</th><th>Quantity</th></tr>
        </thead>
        <tbody>
          {data.materials.map((m) => (
            <tr key={m.id}><td>{m.name}</td><td>{m.unit}</td><td>{m.current_quantity}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
