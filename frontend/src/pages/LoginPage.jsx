import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profile = await login(form.username, form.password);
      toast.success('Welcome back!');
      navigate(profile.roles?.includes('ROLE_ADMIN') ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <p className="mt-1 text-sm text-slate-500">Demo: student / student123 or admin / admin123</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="input-field" placeholder="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="input-field" type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          No account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
