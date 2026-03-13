import { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import { PageHeader, Badge, Modal, EmptyState, Tabs, ShimmerCard } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
 
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('student');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [assigning, setAssigning] = useState(false);

  const load = async (role = tab) => {
    setLoading(true);
    try {
      const [usersRes, mentorsRes] = await Promise.all([
        userAPI.getAll({ role, search, limit: 50 }),
        userAPI.getMentors(),
      ]);
      setStudents(usersRes.data.users || []);
      setTotal(usersRes.data.total || 0);
      setMentors(mentorsRes.data.mentors || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(tab); }, [tab, search]);

  const handleAssign = async () => {
    if (!selectedMentor) return toast.error('Select a mentor');
    setAssigning(true);
    try {
      await userAPI.assignMentor({ studentId: assignModal._id, mentorId: selectedMentor });
      toast.success('Mentor assigned!');
      setAssignModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    } finally { setAssigning(false); }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await userAPI.toggleStatus(userId);
      toast.success(res.data.message);
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user ${name}? This cannot be undone.`)) return;
    try {
      await userAPI.delete(userId);
      toast.success('User deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="anim-fade-in">
      <PageHeader title="User Management" subtitle={`${total} users on the platform`} />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-input" placeholder="⌕ Search by name, email, college…" style={{ maxWidth: 320 }}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Tabs tabs={[
        { value: 'student', label: 'Students' },
        { value: 'mentor', label: 'Mentors' },
        { value: 'admin', label: 'Admins' },
      ]} active={tab} onChange={setTab} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4].map(i => <ShimmerCard key={i} height={80} />)}
        </div>
      ) : students.length === 0 ? (
        <EmptyState icon="👥" title={`No ${tab}s found`} desc="No users match your search or filter." />
      ) : (
        <div className="table-wrap">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>College / Org</th>
                  {tab === 'student' && <><th>Mentor</th><th>Score</th></>}
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm avatar-cyan">{u.name?.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text2)' }}>{u.college || '—'}</td>
                    {tab === 'student' && (
                      <>
                        <td style={{ fontSize: 13 }}>
                          {u.studentProfile?.assignedMentor?.name || (
                            <button className="btn btn-ghost btn-sm" onClick={() => { setAssignModal(u); setSelectedMentor(''); }}>
                              + Assign
                            </button>
                          )}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 14 }}>
                            {u.studentProfile?.skillRatingScore || 0}
                          </span>
                        </td>
                      </>
                    )}
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {tab === 'student' && u.studentProfile?.assignedMentor && (
                          <button className="btn btn-ghost btn-sm" onClick={() => { setAssignModal(u); setSelectedMentor(u.studentProfile.assignedMentor._id || ''); }}>
                            ↩ Reassign
                          </button>
                        )}
                        <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggleStatus(u._id)}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Mentor Modal */}
      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title={`Assign Mentor to ${assignModal?.name}`}>
        {assignModal && (
          <div>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>
              Currently assigned: <strong>{assignModal.studentProfile?.assignedMentor?.name || 'None'}</strong>
            </p>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Select Mentor</label>
              <select className="form-select" value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)}>
                <option value="">Choose a mentor…</option>
                {mentors.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                ))}
              </select>
            </div>
            {mentors.length === 0 && (
              <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,.08)', borderRadius: 10, fontSize: 13, color: 'var(--amber)', marginBottom: 20 }}>
                ⚠️ No mentors registered yet. Ask mentors to create accounts first.
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAssign} disabled={assigning || !selectedMentor}>
                {assigning ? 'Assigning…' : 'Assign Mentor'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
