import { useState, useEffect } from 'react';
import { certificateAPI, userAPI } from '../../utils/api';
import { PageHeader, Badge, EmptyState, Modal, Tabs } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function MentorCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Pending');
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      // Get all students' certs via students API
      const studRes = await userAPI.getMyStudents();
      const studentIds = (studRes.data.students || []).map(s => s._id);
      // For demo, we'll show a placeholder — in production, a dedicated endpoint would exist
      setCerts([]);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async (status) => {
    setSubmitting(true);
    try {
      await certificateAPI.verify(selected._id, { status, mentorFeedback: feedback });
      toast.success(`Certificate ${status === 'Mentor Approved' ? 'approved' : 'rejected'}!`);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSubmitting(false); }
  };

  const statusBadge = { 'Pending': 'amber', 'AI Verified': 'cyan', 'Mentor Approved': 'green', 'Rejected': 'red' };

  const filtered = certs.filter(c => {
    if (tab === 'Pending') return ['Pending', 'AI Verified'].includes(c.verificationStatus);
    if (tab === 'Approved') return c.verificationStatus === 'Mentor Approved';
    if (tab === 'Rejected') return c.verificationStatus === 'Rejected';
    return true;
  });

  return (
    <div className="anim-fade-in">
      <PageHeader title="Verify Certificates" subtitle="Review and approve student certificate submissions" />

      <Tabs tabs={[
        { value: 'Pending', label: `Pending (${certs.filter(c => ['Pending','AI Verified'].includes(c.verificationStatus)).length})` },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'all', label: 'All' },
      ]} active={tab} onChange={setTab} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text2)' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🎓"
          title={tab === 'Pending' ? 'No certificates to review' : 'No certificates here'}
          desc={tab === 'Pending' ? "Great! No student certificates waiting for your review." : 'Certificates will appear here.'}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {filtered.map(c => (
            <div key={c._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 36 }}>{c.type === 'Internship' ? '🎓' : '📜'}</span>
                <Badge type={statusBadge[c.verificationStatus] || 'amber'}>{c.verificationStatus}</Badge>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>{c.issuingOrganization}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>
                Student: {c.student?.name} · {c.issueDate ? new Date(c.issueDate).toLocaleDateString() : '—'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={c.fileUrl} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                  <button className="btn btn-ghost btn-sm btn-full">↗ View File</button>
                </a>
                {['Pending', 'AI Verified'].includes(c.verificationStatus) && (
                  <button className="btn btn-primary btn-sm" onClick={() => { setSelected(c); setFeedback(''); }}>
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info card when no certs */}
      {!loading && certs.length === 0 && (
        <div className="card" style={{ marginTop: 20, background: 'rgba(0,229,255,.04)', borderColor: 'rgba(0,229,255,.2)' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>ℹ️ Certificate Verification</div>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65 }}>
            When your students upload certificates, they will appear here for your review. You can approve or reject them with feedback. Approved certificates are then sent to admin for final verification.
          </p>
        </div>
      )}

      {/* Review Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Review Certificate">
        {selected && (
          <div>
            <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{selected.title}</div>
              <div style={{ color: 'var(--text2)', marginBottom: 4 }}>{selected.issuingOrganization}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>Student: {selected.student?.name}</div>
            </div>
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <a href={selected.fileUrl} target="_blank" rel="noreferrer">
                <button className="btn btn-ghost btn-sm">↗ View Certificate File</button>
              </a>
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Feedback (optional)</label>
              <textarea className="form-textarea" placeholder="Provide feedback to student…" value={feedback}
                onChange={e => setFeedback(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleVerify('Rejected')} disabled={submitting}>
                ✗ Reject
              </button>
              <button className="btn btn-success" onClick={() => handleVerify('Mentor Approved')} disabled={submitting}>
                {submitting ? 'Saving…' : '✓ Approve'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
