import { useState, useEffect } from 'react';
import { analyticsAPI, userAPI } from '../../utils/api';
import { StatCard, Badge, ProgressBar, ShimmerCard } from '../../components/common/UIComponents';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.admin().then(r => setAnalytics(r.data.analytics)),
      userAPI.getAll({ role: 'student', limit: 5 }).then(r => setRecentStudents(r.data.users || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="anim-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Platform overview and key metrics.</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[1,2,3,4,5,6].map(i => <ShimmerCard key={i} height={120} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard label="Total Students" value={analytics?.totalStudents || 0} icon="👥" iconBg="rgba(0,229,255,.1)" iconColor="var(--cyan)" />
          <StatCard label="Active Mentors" value={analytics?.totalMentors || 0} icon="👩‍🏫" iconBg="rgba(168,85,247,.1)" iconColor="var(--violet2)" />
          <StatCard label="Active Internships" value={analytics?.internships?.active || 0} icon="🏢" iconBg="rgba(16,185,129,.1)" iconColor="var(--green)" />
          <StatCard label="Reports (Month)" value={analytics?.reports?.thisMonth || 0} icon="📋" iconBg="rgba(245,158,11,.1)" iconColor="var(--amber)" />
          <StatCard label="Avg Skill Score" value={analytics?.avgSkillScore ? `${analytics.avgSkillScore.toFixed(1)}` : '—'} icon="⚡" iconBg="rgba(0,229,255,.1)" iconColor="var(--cyan)" />
          <StatCard label="Placement Ready" value={analytics?.placementReady || 0} icon="🎯" iconBg="rgba(239,68,68,.1)" iconColor="var(--red)" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        {/* Quick Actions */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { to: '/admin/students', icon: '👥', label: 'Manage Students', desc: 'Assign mentors, view profiles' },
              { to: '/admin/analytics', icon: '📊', label: 'View Analytics', desc: 'Platform-wide metrics' },
              { to: '/admin/placement', icon: '🎯', label: 'Placement Readiness', desc: 'Track placement pipeline' },
              { to: '/admin/notifications', icon: '🔔', label: 'Send Notifications', desc: 'Bulk announcements' },
            ].map(({ to, icon, label, desc }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', transition: 'all .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.background = 'rgba(0,229,255,.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--text3)' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17 }}>Recent Students</div>
            <Link to="/admin/students"><button className="btn btn-ghost btn-sm">View All</button></Link>
          </div>
          {recentStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text3)', fontSize: 14 }}>No students yet</div>
          ) : (
            recentStudents.map(s => (
              <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="avatar avatar-sm avatar-cyan">{s.name?.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.college || s.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: 14 }}>{s.studentProfile?.skillRatingScore || 0}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Score</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
