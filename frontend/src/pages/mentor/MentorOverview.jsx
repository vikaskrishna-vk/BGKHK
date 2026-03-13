import { useState, useEffect } from 'react';
import { userAPI, reportAPI, internshipAPI } from '../../utils/api';
import { StatCard, Badge, ProgressBar, ShimmerCard } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MentorOverview() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userAPI.getMyStudents().then(r => setStudents(r.data.students || [])),
      reportAPI.getMentor({ limit: 5, status: 'Submitted' }).then(r => setReports(r.data.reports || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pendingReports = reports.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length;
  const activeStudents = students.filter(s => s.studentProfile?.currentInternship).length;

  return (
    <div className="anim-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👩‍🏫
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Here's what needs your attention today.</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[1,2,3,4].map(i => <ShimmerCard key={i} height={120} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard label="Total Students" value={students.length} icon="👥" iconBg="rgba(0,229,255,.1)" iconColor="var(--cyan)" />
          <StatCard label="Active Interns" value={activeStudents} icon="🏢" iconBg="rgba(168,85,247,.1)" iconColor="var(--violet2)" />
          <StatCard label="Pending Reviews" value={pendingReports} icon="📋" iconBg="rgba(245,158,11,.1)" iconColor="var(--amber)" />
          <StatCard label="Certificates" value="—" icon="🎓" iconBg="rgba(16,185,129,.1)" iconColor="var(--green)" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        {/* Pending Reports */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17 }}>Pending Reviews</div>
            <Link to="/mentor/reports"><button className="btn btn-ghost btn-sm">View All</button></Link>
          </div>
          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text3)', fontSize: 14 }}>
              ✓ All reports reviewed!
            </div>
          ) : (
            reports.slice(0, 5).map(r => (
              <div key={r._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.student?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>Week {r.weekNumber} · {r.internship?.company?.name}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge badge-amber">Pending</span>
                  <Link to="/mentor/reports"><button className="btn btn-primary btn-sm">Review</button></Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Student Overview */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17 }}>My Students</div>
            <Link to="/mentor/students"><button className="btn btn-ghost btn-sm">View All</button></Link>
          </div>
          {students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text3)', fontSize: 14 }}>
              No students assigned yet
            </div>
          ) : (
            students.slice(0, 5).map(s => (
              <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="avatar avatar-sm avatar-cyan">{s.name?.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.department || s.college || 'Student'}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13 }}>
                  <div style={{ color: 'var(--cyan)', fontWeight: 700 }}>{s.studentProfile?.skillRatingScore || 0}</div>
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
