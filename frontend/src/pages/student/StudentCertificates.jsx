// ─── StudentCertificates.jsx ──────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { certificateAPI, internshipAPI } from '../../utils/api';
import { Badge, PageHeader, Modal, EmptyState } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export function StudentCertificates() {
  const [certs, setCerts] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', issuingOrganization: '', issueDate: '', credentialId: '', type: 'Internship', internshipId: '' });
  const fileRef = useRef();

  const load = () => {
    Promise.all([
      certificateAPI.getMy().then(r => setCerts(r.data.certificates || [])),
      internshipAPI.getMy().then(r => setInternships(r.data.internships || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !form.title || !form.issuingOrganization) return toast.error('Please fill required fields and select a file');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('certificate', file);
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await certificateAPI.upload(fd);
      toast.success('Certificate uploaded!');
      setShowModal(false);
      setFile(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setSubmitting(false); }
  };

  const statusBadge = { 'Pending': 'amber', 'AI Verified': 'cyan', 'Mentor Approved': 'green', 'Admin Approved': 'green', 'Rejected': 'red' };

  return (
    <div className="anim-fade-in">
      <PageHeader title="Certificates" subtitle="Upload and manage your verified certificates">
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Upload Certificate</button>
      </PageHeader>

      {/* Verification pipeline */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Verification Pipeline</div>
        <div style={{ display: 'flex', gap: 0, position: 'relative', flexWrap: 'wrap' }}>
          {[
            { step: 1, label: 'Upload', icon: '📤', desc: 'Student uploads PDF/image' },
            { step: 2, label: 'AI Scan', icon: '🤖', desc: 'AI validates document' },
            { step: 3, label: 'Mentor Review', icon: '👩‍🏫', desc: 'Mentor approves' },
            { step: 4, label: 'Verified ✓', icon: '🏆', desc: 'Added to profile' },
          ].map((s, i) => (
            <div key={i} style={{ flex: '1 1 120px', textAlign: 'center', position: 'relative', padding: '0 8px' }}>
              {i < 3 && <div style={{ position: 'absolute', top: 16, left: '60%', right: '-20%', height: 2, background: 'linear-gradient(90deg,var(--cyan),var(--violet2))', opacity: 0.4 }} />}
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--violet2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: 16, color: '#000', fontWeight: 700, position: 'relative', zIndex: 1 }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>Loading…</div>
      ) : certs.length === 0 ? (
        <div>
          <EmptyState icon="🎓" title="No certificates yet" desc="Upload your internship and course certificates to build your verified portfolio."
            action={<button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Upload Certificate</button>} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {certs.map(c => (
            <div key={c._id} className="card">
              <div style={{ fontSize: 40, marginBottom: 14 }}>{c.type === 'Internship' ? '🎓' : c.type === 'Course' ? '📜' : '⭐'}</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>
                {c.issuingOrganization}{c.issueDate ? ` · ${new Date(c.issueDate).toLocaleDateString()}` : ''}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge type={statusBadge[c.verificationStatus] || 'amber'}>{c.verificationStatus}</Badge>
                <a href={c.fileUrl} target="_blank" rel="noreferrer">
                  <button className="btn btn-ghost btn-sm">↗ View</button>
                </a>
              </div>
            </div>
          ))}

          {/* Upload tile */}
          <div className="card" style={{ border: '2px dashed var(--border2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, cursor: 'pointer', transition: 'all .2s' }}
            onClick={() => setShowModal(true)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📤</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Upload New Certificate</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>PDF or Image, max 10MB</div>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Certificate">
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['Certificate Title *', 'title', 'Frontend Developer Internship Certificate', 'text'],
            ['Issuing Organization *', 'issuingOrganization', 'TechCorp India', 'text'],
            ['Issue Date', 'issueDate', '', 'date'],
            ['Credential ID (optional)', 'credentialId', 'ABC123', 'text'],
          ].map(([label, key, placeholder, type]) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <input className="form-input" type={type} placeholder={placeholder}
                value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                required={label.includes('*')} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
              <option>Internship</option><option>Course</option><option>Skill</option><option>Achievement</option>
            </select>
          </div>
          {internships.length > 0 && (
            <div className="form-group">
              <label className="form-label">Link to Internship (optional)</label>
              <select className="form-select" value={form.internshipId} onChange={e => setForm(p => ({ ...p, internshipId: e.target.value }))}>
                <option value="">None</option>
                {internships.map(i => <option key={i._id} value={i._id}>{i.company?.name} – {i.role}</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Certificate File * (PDF or Image)</label>
            <div style={{ border: '2px dashed var(--border2)', borderRadius: 10, padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s' }}
              onClick={() => fileRef.current?.click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <div style={{ color: 'var(--green)', fontWeight: 600, fontSize: 14 }}>✓ {file.name}</div>
              ) : (
                <div style={{ color: 'var(--text2)', fontSize: 14 }}>Click to select file</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Uploading…' : 'Upload Certificate'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StudentCertificates;
