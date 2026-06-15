import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {['fullName', 'username', 'email', 'password'].map((field) => (
            <input key={field} className="input-field"
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              placeholder={field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
          ))}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Have an account? <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
