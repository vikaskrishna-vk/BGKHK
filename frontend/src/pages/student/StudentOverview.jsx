import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, internshipAPI } from '../../utils/api';
import { StatCard, ScoreRing, ProgressBar, Badge, Timeline, ScoreBreakdown, ShimmerCard } from '../../components/common/UIComponents';

export default function StudentOverview() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.student().then(r => setAnalytics(r.data.analytics)),
      internshipAPI.getMy().then(r => setInternships(r.data.internships || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const activeInternship = internships.find(i => i.status === 'Active');
  const skillScore = user?.studentProfile?.skillRatingScore || analytics?.skillScore || 0;
  const placementReady = user?.studentProfile?.placementReadiness || analytics?.placementReadiness || 0;

  const timelineItems = [
    { icon: '📋', title: 'Profile setup complete', sub: 'Welcome to InternAI!' },
    { icon: '🤖', title: 'AI tools available', sub: 'Try the Career Chatbot' },
    { icon: '🏢', title: 'Add your first internship', sub: 'Track your progress' },
  ];

  return (
    <div className="anim-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          Good morning, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Here's your career progress at a glance.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[1,2,3,4].map(i => <ShimmerCard key={i} height={120} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard label="Placement Readiness" value={`${placementReady}%`} change="Updated today" icon="🚀" iconBg="rgba(0,229,255,.1)" iconColor="var(--cyan)" />
          <StatCard label="Skill Rating" value={`${skillScore}/100`} icon="⚡" iconBg="rgba(168,85,247,.1)" iconColor="var(--violet2)" />
          <StatCard label="Reports Submitted" value={`${analytics?.reports?.total || 0}`} icon="📋" iconBg="rgba(16,185,129,.1)" iconColor="var(--green)" />
          <StatCard label="Certificates" value={`${analytics?.certificates?.verified || 0} Verified`} icon="🎓" iconBg="rgba(245,158,11,.1)" iconColor="var(--amber)" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20, marginBottom: 20 }}>
        {/* Skill Score Card */}
        <div className="card card-glow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 4 }}>AI Skill Score</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>Composite rating breakdown</div>
            </div>
            <ScoreRing value={skillScore} size={100} label="Overall" />
          </div>
          <ScoreBreakdown label="Internship Performance" value={analytics?.internshipPerformance || 0} color="var(--cyan)" weight="40%" />
          <ScoreBreakdown label="AI Test Results" value={analytics?.aiTestResults || 0} color="var(--violet2)" weight="30%" />
          <ScoreBreakdown label="Mentor Feedback" value={analytics?.mentorFeedback || 0} color="var(--green)" weight="20%" />
          <ScoreBreakdown label="Project Score" value={analytics?.projectScore || 0} color="var(--amber)" weight="10%" />
        </div>

        {/* Active Internship */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 16 }}>Active Internship</div>
          {activeInternship ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{activeInternship.company?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>{activeInternship.role}</div>
                </div>
                <Badge type="cyan">Active</Badge>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text2)' }}>Progress</span>
                  <span style={{ color: 'var(--cyan)' }}>{activeInternship.progress}%</span>
                </div>
                <ProgressBar value={activeInternship.progress} />
              </div>
              {[
                ['Domain', activeInternship.domain],
                ['Mode', activeInternship.mode],
                ['Mentor', activeInternship.mentor?.name || 'Not assigned'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text2)' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              <Link to="/student/reports">
                <button className="btn btn-primary btn-sm btn-full" style={{ marginTop: 16 }}>Submit Weekly Report</button>
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16 }}>No active internship</div>
              <Link to="/student/internships">
                <button className="btn btn-primary btn-sm">+ Add Internship</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
        {/* Quick AI Actions */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 16 }}>✦ AI Tools</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { to: '/student/ai-chat', icon: '🤖', label: 'Ask AI Career Advisor', desc: 'Get personalized guidance' },
              { to: '/student/resume', icon: '📄', label: 'Analyze My Resume', desc: 'Get ATS score & tips' },
              { to: '/student/interview', icon: '🎤', label: 'Practice Interview', desc: 'AI mock questions' },
              { to: '/student/roadmap', icon: '🗺️', label: 'Generate Roadmap', desc: 'Your career path' },
            ].map(({ to, icon, label, desc }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .18s' }}
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

        {/* Timeline */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Activity Timeline</div>
          <Timeline items={timelineItems} />
        </div>
      </div>
    </div>
  );
}
