import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ReportsPage() {
  const [stock, setStock] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/reports/stock'), api.get('/reports/transactions')]).then(([s, t]) => {
      setStock(s.data);
      setTransactions(t.data);
    });
  }, []);

  return (
    <div>
      <h2>Reports</h2>

      <h3>Stock Report</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Name</th><th>Unit</th><th>Current Qty</th></tr></thead>
        <tbody>
          {stock.map((s) => <tr key={s.id}><td>{s.name}</td><td>{s.unit}</td><td>{s.current_quantity}</td></tr>)}
        </tbody>
      </table>

      <h3>Transactions Report</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Type</th><th>Material</th><th>Qty Change</th><th>Ref</th><th>Date</th></tr></thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.txn_type}</td>
              <td>{t.material_name}</td>
              <td>{t.quantity_change}</td>
              <td>{t.reference_type} #{t.reference_id || '-'}</td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
