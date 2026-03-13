import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import { PageHeader, Badge } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    college: user?.college || '',
    department: user?.department || '',
    year: user?.year || '',
    studentProfile: {
      rollNumber: user?.studentProfile?.rollNumber || '',
      careerGoal: user?.studentProfile?.careerGoal || '',
      linkedIn: user?.studentProfile?.linkedIn || '',
      github: user?.studentProfile?.github || '',
      portfolio: user?.studentProfile?.portfolio || '',
    },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const sf = (key, val) => setForm(p => ({ ...p, studentProfile: { ...p.studentProfile, [key]: val } }));

  return (
    <div className="anim-fade-in">
      <PageHeader title="My Profile" subtitle="Manage your account and professional details">
        {editing ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>✎ Edit Profile</button>
        )}
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        {/* Personal Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div className="avatar avatar-xl avatar-cyan">{user?.name?.charAt(0)}</div>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{user?.email}</div>
              <div style={{ marginTop: 6 }}><Badge type="cyan">{user?.role}</Badge></div>
            </div>
          </div>

          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Personal Details</div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Name', 'name', 'Arjun Sharma'], ['Phone', 'phone', '+91 9876543210'], ['College', 'college', 'IIT Bombay'], ['Department', 'department', 'Computer Science']].map(([label, key, placeholder]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" placeholder={placeholder} value={form[key]}
                    onChange={e => f(key, e.target.value)} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Year of Study</label>
                <select className="form-select" value={form.year} onChange={e => f('year', e.target.value)}>
                  {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Tell us about yourself…"
                  value={form.bio} onChange={e => f('bio', e.target.value)} />
              </div>
            </div>
          ) : (
            <div>
              {[
                ['Email', user?.email],
                ['Phone', user?.phone || '—'],
                ['College', user?.college || '—'],
                ['Department', user?.department || '—'],
                ['Year', user?.year ? `Year ${user.year}` : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text2)' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              {user?.bio && <p style={{ marginTop: 14, fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{user.bio}</p>}
            </div>
          )}
        </div>

        {/* Career Profile */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Career Profile</div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Career Goal</label>
                <input className="form-input" placeholder="e.g. Senior Full-Stack Developer" value={form.studentProfile.careerGoal}
                  onChange={e => sf('careerGoal', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input className="form-input" placeholder="CS20B001" value={form.studentProfile.rollNumber}
                  onChange={e => sf('rollNumber', e.target.value)} />
              </div>
              {[['LinkedIn', 'linkedIn', 'https://linkedin.com/in/username'], ['GitHub', 'github', 'https://github.com/username'], ['Portfolio', 'portfolio', 'https://yoursite.com']].map(([label, key, placeholder]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" placeholder={placeholder} value={form.studentProfile[key]}
                    onChange={e => sf(key, e.target.value)} />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {[
                ['Career Goal', user?.studentProfile?.careerGoal || '—'],
                ['Roll Number', user?.studentProfile?.rollNumber || '—'],
                ['Placement Readiness', `${user?.studentProfile?.placementReadiness || 0}%`],
                ['Skill Rating', `${user?.studentProfile?.skillRatingScore || 0}/100`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text2)' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {user?.studentProfile?.linkedIn && <a href={user.studentProfile.linkedIn} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">LinkedIn ↗</button></a>}
                {user?.studentProfile?.github && <a href={user.studentProfile.github} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">GitHub ↗</button></a>}
                {user?.studentProfile?.portfolio && <a href={user.studentProfile.portfolio} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">Portfolio ↗</button></a>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
