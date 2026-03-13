// ─── AdminAnalytics.jsx ───────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../utils/api';
import { PageHeader, ScoreRing, ProgressBar, StatCard } from '../../components/common/UIComponents';

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.admin()
      .then(r => setAnalytics(r.data.analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const domains = analytics?.domainDistribution || [
    { domain: 'Frontend Development', count: 28 },
    { domain: 'Data Science', count: 22 },
    { domain: 'Backend Development', count: 19 },
    { domain: 'Full Stack', count: 15 },
    { domain: 'DevOps', count: 8 },
    { domain: 'Mobile Development', count: 6 },
  ];

  const maxDomain = Math.max(...domains.map(d => d.count));
  const colors = ['var(--cyan)', 'var(--violet2)', 'var(--pink)', 'var(--green)', 'var(--amber)', 'var(--red)'];

  return (
    <div className="anim-fade-in">
      <PageHeader title="Platform Analytics" subtitle="Comprehensive data insights across the entire platform" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Students" value={analytics?.totalStudents || '—'} icon="👥" iconBg="rgba(0,229,255,.1)" iconColor="var(--cyan)" />
        <StatCard label="Completed Internships" value={analytics?.internships?.completed || '—'} icon="✓" iconBg="rgba(16,185,129,.1)" iconColor="var(--green)" />
        <StatCard label="Verified Certificates" value={analytics?.certificates?.adminApproved || '—'} icon="🎓" iconBg="rgba(168,85,247,.1)" iconColor="var(--violet2)" />
        <StatCard label="Avg Placement Score" value={analytics?.avgPlacementScore ? `${analytics.avgPlacementScore.toFixed(1)}%` : '—'} icon="🎯" iconBg="rgba(245,158,11,.1)" iconColor="var(--amber)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        {/* Domain Distribution */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Domain Distribution</div>
          {domains.map((d, i) => (
            <div key={d.domain} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text2)' }}>{d.domain}</span>
                <span style={{ color: colors[i], fontWeight: 600 }}>{d.count}</span>
              </div>
              <ProgressBar value={(d.count / maxDomain) * 100} color={colors[i]} />
            </div>
          ))}
        </div>

        {/* Score Distribution */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Score Distribution</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
            <ScoreRing value={analytics?.avgSkillScore ? Math.round(analytics.avgSkillScore) : 68} color="var(--cyan)" label="Avg Skill Score" size={100} />
            <ScoreRing value={analytics?.avgPlacementScore ? Math.round(analytics.avgPlacementScore) : 62} color="var(--violet2)" label="Avg Placement" size={100} />
          </div>

          <div style={{ marginTop: 24 }}>
            {[
              { label: '90+ (Excellent)', count: analytics?.scoreDistribution?.excellent || 12, color: 'var(--green)' },
              { label: '75–89 (Good)', count: analytics?.scoreDistribution?.good || 35, color: 'var(--cyan)' },
              { label: '50–74 (Average)', count: analytics?.scoreDistribution?.average || 48, color: 'var(--amber)' },
              { label: 'Below 50', count: analytics?.scoreDistribution?.belowAverage || 18, color: 'var(--red)' },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                  <span style={{ color: 'var(--text2)' }}>{label}</span>
                </div>
                <span style={{ fontWeight: 600, color }}>{count} students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend (Simple) */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Monthly Activity</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 12 }}>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => {
              const reports = analytics?.monthlyReports?.[i] || Math.floor(Math.random() * 60) + 10;
              const maxVal = 80;
              return (
                <div key={month} style={{ textAlign: 'center' }}>
                  <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 6 }}>
                    <div style={{
                      width: 36, borderRadius: '6px 6px 0 0',
                      height: `${(reports / maxVal) * 80}px`,
                      background: `linear-gradient(to top, var(--cyan), var(--violet2))`,
                      opacity: 0.8,
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{month}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{reports}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8, textAlign: 'center' }}>Reports submitted per month</div>
        </div>
      </div>
    </div>
  );
}

// ─── AdminPlacement.jsx ───────────────────────────────────────────────────────
import { userAPI as uAPI } from '../../utils/api';

export function AdminPlacement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    uAPI.getAll({ role: 'student', limit: 100 })
      .then(r => setStudents(r.data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const score = s.studentProfile?.placementReadiness || 0;
    if (filter === 'ready') return score >= 80;
    if (filter === 'close') return score >= 60 && score < 80;
    if (filter === 'needs-work') return score < 60;
    return true;
  });

  const getStatusColor = (score) => {
    if (score >= 80) return 'var(--green)';
    if (score >= 60) return 'var(--amber)';
    return 'var(--red)';
  };

  const getStatusLabel = (score) => {
    if (score >= 80) return { label: 'Placement Ready', type: 'green' };
    if (score >= 60) return { label: 'Almost Ready', type: 'amber' };
    return { label: 'Needs Work', type: 'red' };
  };

  return (
    <div className="anim-fade-in">
      <PageHeader title="Placement Dashboard" subtitle="Track and manage student placement readiness" />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Students" value={students.length} icon="👥" iconBg="rgba(0,229,255,.1)" iconColor="var(--cyan)" />
        <StatCard label="Placement Ready (80+)" value={students.filter(s => (s.studentProfile?.placementReadiness || 0) >= 80).length} icon="✅" iconBg="rgba(16,185,129,.1)" iconColor="var(--green)" />
        <StatCard label="Almost Ready (60+)" value={students.filter(s => (s.studentProfile?.placementReadiness || 0) >= 60 && (s.studentProfile?.placementReadiness || 0) < 80).length} icon="⏳" iconBg="rgba(245,158,11,.1)" iconColor="var(--amber)" />
        <StatCard label="Needs Work (<60)" value={students.filter(s => (s.studentProfile?.placementReadiness || 0) < 60).length} icon="⚠️" iconBg="rgba(239,68,68,.1)" iconColor="var(--red)" />
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all','All Students'],['ready','Placement Ready'],['close','Almost Ready'],['needs-work','Needs Work']].map(([val, label]) => (
          <button key={val} className="btn btn-sm" onClick={() => setFilter(val)}
            style={{ background: filter === val ? 'rgba(0,229,255,.1)' : 'var(--surface)', color: filter === val ? 'var(--cyan)' : 'var(--text2)', border: `1px solid ${filter === val ? 'var(--cyan)' : 'var(--border)'}` }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text2)' }}>Loading…</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>College</th>
                  <th>Skill Score</th>
                  <th>Placement Readiness</th>
                  <th>Status</th>
                  <th>Career Goal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No students match this filter</td></tr>
                ) : (
                  filtered.map(s => {
                    const placement = s.studentProfile?.placementReadiness || 0;
                    const { label, type } = getStatusLabel(placement);
                    return (
                      <tr key={s._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="avatar avatar-sm avatar-cyan">{s.name?.charAt(0)}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text2)' }}>{s.college || '—'}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 14 }}>
                            {s.studentProfile?.skillRatingScore || 0}/100
                          </span>
                        </td>
                        <td style={{ minWidth: 160 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1 }}><ProgressBar value={placement} color={getStatusColor(placement)} /></div>
                            <span style={{ fontWeight: 600, color: getStatusColor(placement), fontSize: 13, minWidth: 32 }}>{placement}%</span>
                          </div>
                        </td>
                        <td><span className={`badge badge-${type}`}>{label}</span></td>
                        <td style={{ fontSize: 13, color: 'var(--text2)' }}>{s.studentProfile?.careerGoal || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AdminNotifications.jsx ───────────────────────────────────────────────────
import { notificationAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export function AdminNotifications() {
  const [form, setForm] = useState({ title: '', message: '', type: 'system', targetRole: 'all' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return toast.error('Title and message are required');
    setSending(true);
    try {
      await notificationAPI.sendBulk(form);
      toast.success('Notification sent to all users!');
      setSent(prev => [{ ...form, sentAt: new Date() }, ...prev]);
      setForm({ title: '', message: '', type: 'system', targetRole: 'all' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally { setSending(false); }
  };

  const typeOpts = [
    { value: 'system', label: '📢 System Announcement' },
    { value: 'placement', label: '🎯 Placement Update' },
    { value: 'certificate_verified', label: '🎓 Certificate Update' },
    { value: 'internship_approved', label: '🏢 Internship Update' },
  ];

  return (
    <div className="anim-fade-in">
      <PageHeader title="Notifications" subtitle="Send bulk announcements and notifications to users" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        {/* Compose */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Compose Notification</div>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="e.g. Important Placement Drive Update" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-textarea" placeholder="Write your message here…" value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Notification Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {typeOpts.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select className="form-select" value={form.targetRole} onChange={e => setForm(p => ({ ...p, targetRole: e.target.value }))}>
                  <option value="all">All Users</option>
                  <option value="student">Students Only</option>
                  <option value="mentor">Mentors Only</option>
                </select>
              </div>
            </div>

            {/* Preview */}
            {form.title && (
              <div style={{ padding: '14px 16px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Preview</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{form.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{form.message}</div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={sending} style={{ padding: 14 }}>
              {sending ? '⏳ Sending…' : `📢 Send to ${form.targetRole === 'all' ? 'All Users' : form.targetRole.charAt(0).toUpperCase() + form.targetRole.slice(1) + 's'}`}
            </button>
          </form>
        </div>

        {/* Recent Sent */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 16 }}>Recent Notifications</div>
          {sent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
              Notifications you send will appear here
            </div>
          ) : (
            sent.map((n, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                  <span className="badge badge-cyan" style={{ fontSize: 10 }}>{n.targetRole}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{n.message.substring(0, 100)}{n.message.length > 100 ? '…' : ''}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Sent {n.sentAt.toLocaleTimeString()}</div>
              </div>
            ))
          )}

          {/* Quick Templates */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Quick Templates</div>
            {[
              { title: 'Placement Drive Notice', msg: 'A major placement drive is scheduled next week. Ensure your profiles are complete.' },
              { title: 'Report Submission Reminder', msg: 'This is a reminder to submit your weekly internship report before Friday.' },
              { title: 'Platform Maintenance', msg: 'InternAI will be under maintenance on Sunday 2–4 AM. Plan accordingly.' },
            ].map((t, i) => (
              <div key={i} className="card card-sm" style={{ marginBottom: 8, cursor: 'pointer', padding: '10px 14px', transition: 'all .18s' }}
                onClick={() => setForm(p => ({ ...p, title: t.title, message: t.msg }))}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{t.msg.substring(0, 60)}…</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
