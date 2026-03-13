import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/student', label: 'Overview', icon: '▦', end: true },
  { to: '/student/internships', label: 'Internships', icon: '🏢' },
  { to: '/student/reports', label: 'Weekly Reports', icon: '📋' },
  { to: '/student/certificates', label: 'Certificates', icon: '🎓' },
  { to: '/student/skills', label: 'Skill Analytics', icon: '⚡' },
  { section: 'AI Tools' },
  { to: '/student/ai-chat', label: 'AI Career Chat', icon: '🤖', dot: true },
  { to: '/student/resume', label: 'Resume Analyzer', icon: '📄' },
  { to: '/student/interview', label: 'Mock Interview', icon: '🎤' },
  { to: '/student/roadmap', label: 'Career Roadmap', icon: '🗺️' },
  { section: 'Learning' },
  { to: '/student/study', label: 'Study Materials', icon: '📚' },
  { to: '/student/tests', label: 'Aptitude Tests', icon: '🧪' },
  { section: 'Account' },
  { to: '/student/profile', label: 'My Profile', icon: '👤' },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <aside className="sidebar">
        {/* Mini profile */}
        <div style={{ padding: '4px 8px 16px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar avatar-sm avatar-cyan">{user?.name?.charAt(0)}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{user?.college || 'Student'}</div>
            </div>
          </div>
        </div>

        {NAV.map((item, i) => {
          if (item.section) return <div key={i} className="sidebar-section">{item.section}</div>;
          return (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.dot && <span className="notif-dot" />}
            </NavLink>
          );
        })}

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
