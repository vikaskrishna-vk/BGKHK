import { useState, useEffect } from 'react';
import { internshipAPI } from '../../utils/api';
import { Badge, ProgressBar, PageHeader, Modal, EmptyState, ShimmerCard } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

const DOMAINS = ['Frontend Development','Backend Development','Full Stack Development','Data Science','Machine Learning','DevOps','Mobile Development','UI/UX Design','Cybersecurity','Cloud Computing','Other'];

export default function StudentInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company: { name: '', website: '', location: '', mentorEmail: '', mentorName: '' },
    role: '', domain: '', description: '', startDate: '', endDate: '',
    stipend: { amount: '', currency: 'INR' }, mode: 'Remote',
  });

  const load = () => {
    internshipAPI.getMy()
      .then(r => setInternships(r.data.internships || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.name || !form.role || !form.domain || !form.startDate || !form.endDate || !form.company.mentorEmail) {
      return toast.error('Please fill all required fields');
    }
    setSubmitting(true);
    try {
      await internshipAPI.create(form);
      toast.success('Internship submitted for approval!');
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = { Active: 'cyan', Completed: 'green', 'Pending Approval': 'amber', Rejected: 'red', Flagged: 'red' };

  return (
    <div className="anim-fade-in">
      <PageHeader title="My Internships" subtitle="Track and manage your internship experiences">
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Internship</button>
      </PageHeader>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2].map(i => <ShimmerCard key={i} height={180} />)}
        </div>
      ) : internships.length === 0 ? (
        <EmptyState icon="🏢" title="No internships yet" desc="Add your first internship to start tracking progress and submitting weekly reports."
          action={<button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Internship</button>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {internships.map(intern => (
            <div key={intern._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{intern.company?.name}</h3>
                  <div style={{ fontSize: 14, color: 'var(--text2)' }}>
                    {intern.role} · {intern.domain} · {intern.mode}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
                    {new Date(intern.startDate).toLocaleDateString()} → {new Date(intern.endDate).toLocaleDateString()} · {intern.durationWeeks} weeks
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Badge type={statusBadge[intern.status] || 'amber'}>{intern.status}</Badge>
                  {intern.verificationStatus !== 'Unverified' && (
                    <Badge type={intern.verificationStatus.includes('Verified') ? 'green' : 'red'}>
                      {intern.verificationStatus}
                    </Badge>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text2)' }}>Completion Progress</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{intern.progress}%</span>
                </div>
                <ProgressBar value={intern.progress} />
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                {intern.status === 'Active' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => window.location.href = '/student/reports'}>
                    📋 Submit Report
                  </button>
                )}
                {!intern.certificate && intern.status !== 'Rejected' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => window.location.href = '/student/certificates'}>
                    🎓 Upload Certificate
                  </button>
                )}
                {intern.status === 'Completed' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => internshipAPI.generateFinalReport?.(intern._id)}>
                    📊 Final Report
                  </button>
                )}
                {intern.mentor && (
                  <span style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                    👩‍🏫 {intern.mentor?.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Internship Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Internship" maxWidth={620}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Company Name *</label>
              <input className="form-input" placeholder="TechCorp India" value={form.company.name}
                onChange={e => setForm(p => ({ ...p, company: { ...p.company, name: e.target.value } }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role / Designation *</label>
              <input className="form-input" placeholder="Frontend Developer Intern" value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Domain *</label>
              <select className="form-select" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} required>
                <option value="">Select domain…</option>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Company Mentor Email *</label>
              <input className="form-input" type="email" placeholder="mentor@company.com" value={form.company.mentorEmail}
                onChange={e => setForm(p => ({ ...p, company: { ...p.company, mentorEmail: e.target.value } }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Company Mentor Name</label>
              <input className="form-input" placeholder="John Smith" value={form.company.mentorName}
                onChange={e => setForm(p => ({ ...p, company: { ...p.company, mentorName: e.target.value } }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input className="form-input" type="date" value={form.startDate}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input className="form-input" type="date" value={form.endDate}
                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mode</label>
              <select className="form-select" value={form.mode} onChange={e => setForm(p => ({ ...p, mode: e.target.value }))}>
                <option>Remote</option><option>On-site</option><option>Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Stipend (₹)</label>
              <input className="form-input" type="number" placeholder="0" value={form.stipend.amount}
                onChange={e => setForm(p => ({ ...p, stipend: { ...p.stipend, amount: e.target.value } }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Brief Description</label>
              <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="What will you be working on?"
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 10, padding: 14, fontSize: 13, color: 'var(--amber)' }}>
            ⚠️ Your internship will be verified by your mentor and admin before being marked as Active.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
