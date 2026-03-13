import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }} className="grid-bg">
      <div className="orb orb-cyan" style={{ width: 400, height: 400, top: '5%', right: '10%' }} />
      <div className="orb orb-violet" style={{ width: 500, height: 500, bottom: '5%', left: '5%' }} />
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--bg1)', border: '1px solid var(--border2)', borderRadius: 24, padding: '40px 36px', position: 'relative', zIndex: 1, animation: 'fadeUp .4s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8 }} className="grad-text-cv">✦ InternAI</div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{title}</h1>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields required');
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    setLoading(true);
    try {
      const user = await login({ email: `${role}@demo.internai.com`, password: 'demo123' });
      toast.success(`Logged in as ${role}`);
      navigate(`/${user.role}`);
    } catch {
      // Demo users might not exist — create them
      toast.error('Demo accounts require backend setup. Use register instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your InternAI account">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="arjun@college.edu"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
        </div>
        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8, padding: 12 }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
        <div className="divider" style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>Quick Demo</span>
        <div className="divider" style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {['student', 'mentor', 'admin'].map(role => (
          <button key={role} className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => demoLogin(role)} disabled={loading}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)', marginTop: 24 }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--cyan)', fontWeight: 600 }}>Create one</Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', college: '', department: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Name, email and password are required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to InternAI, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  return (
    <AuthLayout title="Create Account" subtitle="Start your AI-powered career journey">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" placeholder="Arjun Sharma" value={form.name} onChange={e => f('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="arjun@college.edu" value={form.email} onChange={e => f('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => f('password', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">College / Institution</label>
            <input className="form-input" placeholder="IIT Bombay" value={form.college} onChange={e => f('college', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input className="form-input" placeholder="CSE" value={form.department} onChange={e => f('department', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">I am a…</label>
          <select className="form-select" value={form.role} onChange={e => f('role', e.target.value)}>
            <option value="student">Student</option>
            <option value="mentor">Industry Mentor</option>
            <option value="admin">Institution Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8, padding: 12 }} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account →'}
        </button>
      </form>
      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)', marginTop: 24 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
