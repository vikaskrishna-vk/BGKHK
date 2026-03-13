// ─── StudentReports.jsx ───────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { reportAPI, internshipAPI } from '../../utils/api';
import { Badge, PageHeader, Modal, EmptyState, ProgressBar } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export function StudentReports() {
  const [reports, setReports] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    internshipId: '', weekNumber: '', tasksCompleted: '',
    technologiesUsed: '', challengesFaced: '', skillsLearned: '',
    hoursWorked: '', selfRating: 7, nextWeekPlan: '',
    dateRange: { from: '', to: '' },
  });

  const load = () => {
    Promise.all([
      reportAPI.getMy().then(r => setReports(r.data.reports || [])),
      internshipAPI.getMy().then(r => setInternships(r.data.internships?.filter(i => i.status === 'Active') || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.internshipId || !form.weekNumber || !form.tasksCompleted) {
      return toast.error('Please fill all required fields');
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        technologiesUsed: form.technologiesUsed.split(',').map(s => s.trim()).filter(Boolean),
        weekNumber: Number(form.weekNumber),
        hoursWorked: Number(form.hoursWorked) || 0,
      };
      await reportAPI.submit(payload);
      toast.success('Report submitted successfully!');
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  const statusBadge = { Approved: 'green', 'Under Review': 'amber', Submitted: 'cyan', Rejected: 'red', Draft: 'violet' };

  const totalReports = reports.filter(r => r.reportType !== 'final').length;
  const approvedReports = reports.filter(r => r.status === 'Approved').length;

  return (
    <div className="anim-fade-in">
      <PageHeader title="Weekly Reports" subtitle="Submit and track your weekly internship progress reports">
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} disabled={internships.length === 0}>
          + Submit Report
        </button>
      </PageHeader>

      {/* Auto-final report info */}
      <div className="card" style={{ background: 'rgba(0,229,255,.04)', borderColor: 'rgba(0,229,255,.2)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 32 }}>📊</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Auto-Generated Final Report</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>
              At the end of your internship, InternAI automatically combines all approved weekly reports into a comprehensive final report.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--cyan)' }}>{totalReports}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>Submitted</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--green)' }}>{approvedReports}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>Approved</div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text2)', padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : reports.length === 0 ? (
        <EmptyState icon="📋" title="No reports yet" desc="Start submitting weekly reports to track your internship progress."
          action={internships.length > 0 ? <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Submit First Report</button> : <div style={{ fontSize: 13, color: 'var(--text3)' }}>Add an active internship first</div>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reports.map(r => (
            <div key={r._id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16 }}>
                      {r.reportType === 'final' ? '📋 Final Report' : `Week ${r.weekNumber}`}
                    </span>
                    <Badge type={statusBadge[r.status] || 'amber'}>{r.status}</Badge>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                    {r.internship?.company?.name} · Submitted {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {r.mentorRating && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>Mentor Rating</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--green)' }}>
                      {r.mentorRating}/10
                    </div>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 10, fontSize: 14, color: 'var(--text2)', padding: '12px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)', lineHeight: 1.6 }}>
                {r.tasksCompleted?.substring(0, 200)}{r.tasksCompleted?.length > 200 ? '…' : ''}
              </div>
              {r.mentorFeedback && (
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--green)', padding: '10px 14px', background: 'rgba(16,185,129,.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,.2)' }}>
                  💬 Mentor: {r.mentorFeedback}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Weekly Report" maxWidth={600}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Internship *</label>
              <select className="form-select" value={form.internshipId} onChange={e => setForm(p => ({ ...p, internshipId: e.target.value }))} required>
                <option value="">Select internship…</option>
                {internships.map(i => <option key={i._id} value={i._id}>{i.company?.name} – {i.role}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Week Number *</label>
              <input className="form-input" type="number" min="1" max="52" placeholder="1" value={form.weekNumber}
                onChange={e => setForm(p => ({ ...p, weekNumber: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Week From</label>
              <input className="form-input" type="date" value={form.dateRange.from}
                onChange={e => setForm(p => ({ ...p, dateRange: { ...p.dateRange, from: e.target.value } }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Week To</label>
              <input className="form-input" type="date" value={form.dateRange.to}
                onChange={e => setForm(p => ({ ...p, dateRange: { ...p.dateRange, to: e.target.value } }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tasks Completed This Week *</label>
            <textarea className="form-textarea" placeholder="Describe what you accomplished…" value={form.tasksCompleted}
              onChange={e => setForm(p => ({ ...p, tasksCompleted: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Technologies Used (comma-separated)</label>
            <input className="form-input" placeholder="React, Node.js, MongoDB" value={form.technologiesUsed}
              onChange={e => setForm(p => ({ ...p, technologiesUsed: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Challenges Faced</label>
              <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Any blockers or issues?"
                value={form.challengesFaced} onChange={e => setForm(p => ({ ...p, challengesFaced: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Skills Learned</label>
              <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="New things you learned…"
                value={form.skillsLearned} onChange={e => setForm(p => ({ ...p, skillsLearned: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Hours Worked</label>
              <input className="form-input" type="number" min="0" max="80" placeholder="40" value={form.hoursWorked}
                onChange={e => setForm(p => ({ ...p, hoursWorked: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Self Rating (1–10)</label>
              <input className="form-input" type="number" min="1" max="10" value={form.selfRating}
                onChange={e => setForm(p => ({ ...p, selfRating: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Next Week Plan</label>
            <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="What will you work on next week?"
              value={form.nextWeekPlan} onChange={e => setForm(p => ({ ...p, nextWeekPlan: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StudentReports;
