import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', marginBottom: 8 }} />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', marginBottom: 8 }} />
        <button type="submit">Login</button>
      </form>
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}
    </div>
  );
}
