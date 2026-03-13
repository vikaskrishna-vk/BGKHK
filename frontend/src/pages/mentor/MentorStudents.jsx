import { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import { PageHeader, Badge, ProgressBar, ScoreRing, ShimmerCard, EmptyState } from '../../components/common/UIComponents';

export default function MentorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userAPI.getMyStudents()
      .then(r => setStudents(r.data.students || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="anim-fade-in">
      <PageHeader title="My Students" subtitle={`${students.length} students assigned to you`} />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input className="form-input" placeholder="⌕ Search students…" style={{ maxWidth: 300 }}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {[1,2,3,4].map(i => <ShimmerCard key={i} height={200} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👥" title="No students found" desc="Students will appear here once assigned to you by admin." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {filtered.map(s => {
            const score = s.studentProfile?.skillRatingScore || 0;
            const placement = s.studentProfile?.placementReadiness || 0;
            return (
              <div key={s._id} className="card card-interactive" onClick={() => setSelected(s === selected ? null : s)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="avatar avatar-md avatar-cyan">{s.name?.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.college || '—'}</div>
                    </div>
                  </div>
                  <ScoreRing value={score} size={60} />
                </div>

                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>
                  {s.department || '—'} · {s.email}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: 'var(--text3)' }}>Placement Readiness</span>
                    <span style={{ color: 'var(--violet2)', fontWeight: 600 }}>{placement}%</span>
                  </div>
                  <ProgressBar value={placement} color="var(--violet2)" />
                </div>

                {selected?._id === s._id && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', animation: 'fadeIn .2s ease' }}>
                    {[
                      ['Roll No', s.studentProfile?.rollNumber || '—'],
                      ['Goal', s.studentProfile?.careerGoal || '—'],
                      ['Internship Score', `${s.skillRecord?.compositeScore?.internshipPerformance || 0}/100`],
                      ['Test Score', `${s.skillRecord?.compositeScore?.aiTestResults || 0}/100`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text2)' }}>{k}</span>
                        <span>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      {s.studentProfile?.linkedIn && <a href={s.studentProfile.linkedIn} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">LinkedIn</button></a>}
                      {s.studentProfile?.github && <a href={s.studentProfile.github} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">GitHub</button></a>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
