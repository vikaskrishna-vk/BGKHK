import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/students', label: 'Students', icon: '👥' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { to: '/admin/placement', label: 'Placement', icon: '🎯' },
  { to: '/admin/notifications', label: 'Notifications', icon: '🔔' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <aside className="sidebar">
        <div style={{ padding: '4px 8px 16px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar avatar-sm avatar-amber">{user?.name?.charAt(0)}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Administrator</div>
            </div>
          </div>
        </div>

        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button className="sidebar-item" style={{ width: '100%', color: 'var(--red)' }}
            onClick={() => { logout(); navigate('/'); }}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>→</span>
            Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
