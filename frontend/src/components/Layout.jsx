import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Stock Management</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/materials">Materials</Link>
        <Link to="/production">Production/Sales</Link>
        <Link to="/reports">Reports</Link>
        <button onClick={logout}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}
