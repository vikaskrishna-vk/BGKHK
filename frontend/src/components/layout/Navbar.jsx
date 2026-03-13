import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleColors = { student: 'badge-cyan', mentor: 'badge-violet', admin: 'badge-amber' };
  const roleHome = { student: '/student', mentor: '/mentor', admin: '/admin' };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
      background: 'rgba(5,8,16,0.88)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <Link to={user ? roleHome[user.role] : '/'} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <span style={{ fontSize: 20, fontFamily: 'Syne, sans-serif', fontWeight: 800 }} className="grad-text-cv">
          ✦ InternAI
        </span>
      </Link>

      {/* Landing nav links */}
      {isLanding && !user && (
        <div style={{ display: 'flex', gap: 4 }}>
          {['Features', 'How It Works', 'AI Tools'].map(l => (
            <button key={l} className="btn btn-ghost btn-sm" style={{ fontSize: 14, color: 'var(--text2)', background: 'none', border: 'none' }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <NotificationBell />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar avatar-sm avatar-cyan">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{user.name}</span>
                <span className={`badge ${roleColors[user.role]}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                  {user.role}
                </span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn btn-outline btn-sm">Sign In</button></Link>
            <Link to="/register"><button className="btn btn-primary btn-sm">Get Started</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
