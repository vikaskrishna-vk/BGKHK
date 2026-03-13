import { useState, useEffect } from 'react';
import { reportAPI } from '../../utils/api';
import { PageHeader, Badge, Modal, EmptyState, Tabs, ShimmerCard } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function MentorReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Submitted');
  const [selected, setSelected] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 7, feedback: '', status: 'Approved' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    reportAPI.getMentor()
      .then(r => setReports(r.data.reports || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = reports.filter(r => {
    if (tab === 'Submitted') return r.status === 'Submitted' || r.status === 'Under Review';
    if (tab === 'Approved') return r.status === 'Approved';
    if (tab === 'Rejected') return r.status === 'Rejected';
    return true;
  });

  const handleReview = async () => {
    setSubmitting(true);
    try {
      await reportAPI.review(selected._id, {
        mentorRating: reviewForm.rating,
        mentorFeedback: reviewForm.feedback,
        status: reviewForm.status,
      });
      toast.success(`Report ${reviewForm.status.toLowerCase()}!`);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally { setSubmitting(false); }
  };

  const statusBadge = { Approved: 'green', 'Under Review': 'amber', Submitted: 'cyan', Rejected: 'red' };

  const tabs = [
    { value: 'Submitted', label: `Pending (${reports.filter(r => ['Submitted','Under Review'].includes(r.status)).length})` },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'all', label: 'All' },
  ];

  return (
    <div className="anim-fade-in">
      <PageHeader title="Review Reports" subtitle="Review and provide feedback on student weekly reports" />

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <ShimmerCard key={i} height={120} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📋" title={tab === 'Submitted' ? 'No pending reports' : 'No reports here'} desc={tab === 'Submitted' ? "You're all caught up! No reports waiting for review." : 'Reports will appear here.'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(r => (
            <div key={r._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div className="avatar avatar-sm avatar-cyan">{r.student?.name?.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{r.student?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                        Week {r.weekNumber} · {r.internship?.company?.name} · {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge type={statusBadge[r.status] || 'amber'}>{r.status}</Badge>
                  {(r.status === 'Submitted' || r.status === 'Under Review') && (
                    <button className="btn btn-primary btn-sm" onClick={() => { setSelected(r); setReviewForm({ rating: 7, feedback: '', status: 'Approved' }); }}>
                      Review
                    </button>
                  )}
                  {r.mentorRating && <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700 }}>{r.mentorRating}/10</span>}
                </div>
              </div>

              <div style={{ marginTop: 12, padding: 12, background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>Tasks Completed:</strong>
                {r.tasksCompleted?.substring(0, 300)}{r.tasksCompleted?.length > 300 ? '…' : ''}
              </div>

              {r.technologiesUsed?.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.technologiesUsed.map(t => <span key={t} className="badge badge-violet">{t}</span>)}
                </div>
              )}

              {r.mentorFeedback && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(16,185,129,.06)', borderRadius: 8, fontSize: 13, color: 'var(--green)', border: '1px solid rgba(16,185,129,.2)' }}>
                  💬 Your feedback: {r.mentorFeedback}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Review: Week ${selected?.weekNumber} – ${selected?.student?.name}`}>
        {selected && (
          <div>
            {/* Full report */}
            <div style={{ marginBottom: 20 }}>
              {[
                ['Tasks Completed', selected.tasksCompleted],
                ['Skills Learned', selected.skillsLearned],
                ['Challenges Faced', selected.challengesFaced],
                ['Next Week Plan', selected.nextWeekPlan],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, background: 'var(--bg2)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                    {value}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                <span style={{ color: 'var(--text2)' }}>Hours: <strong>{selected.hoursWorked || 0}</strong></span>
                <span style={{ color: 'var(--text2)' }}>Self Rating: <strong>{selected.selfRating}/10</strong></span>
              </div>
            </div>

            {/* Review form */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">Your Rating (1–10)</label>
                <input className="form-input" type="number" min="1" max="10" value={reviewForm.rating}
                  onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">Feedback for Student</label>
                <textarea className="form-textarea" placeholder="Provide constructive feedback…"
                  value={reviewForm.feedback} onChange={e => setReviewForm(p => ({ ...p, feedback: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Decision</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className={`btn btn-sm ${reviewForm.status === 'Approved' ? 'btn-success' : 'btn-ghost'}`}
                    onClick={() => setReviewForm(p => ({ ...p, status: 'Approved' }))}>
                    ✓ Approve
                  </button>
                  <button className={`btn btn-sm ${reviewForm.status === 'Rejected' ? 'btn-danger' : 'btn-ghost'}`}
                    onClick={() => setReviewForm(p => ({ ...p, status: 'Rejected' }))}>
                    ✗ Reject
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
                <button className={`btn ${reviewForm.status === 'Approved' ? 'btn-success' : 'btn-danger'}`}
                  onClick={handleReview} disabled={submitting}>
                  {submitting ? 'Submitting…' : `${reviewForm.status === 'Approved' ? '✓ Approve' : '✗ Reject'} Report`}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
