// ─── StudyMaterialsPage.jsx ───────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { studyAPI } from '../utils/api';
import { PageHeader, Badge, Tabs } from '../components/common/UIComponents';
import toast from 'react-hot-toast';

const MOCK_MATERIALS = [
  { _id: 1, icon: '⚛️', title: 'Complete React Developer Course 2025', domain: 'Frontend Development', type: 'Course', level: 'Intermediate', duration: '40h', url: '#' },
  { _id: 2, icon: '🐍', title: 'Python for Data Science & ML', domain: 'Data Science', type: 'Course', level: 'Beginner', duration: '25h', url: '#' },
  { _id: 3, icon: '🏗️', title: 'System Design Interview Prep', domain: 'All', type: 'Guide', level: 'Advanced', duration: '15h', url: '#' },
  { _id: 4, icon: '🗄️', title: 'SQL Mastery for Data Analysts', domain: 'Data Science', type: 'Course', level: 'Intermediate', duration: '20h', url: '#' },
  { _id: 5, icon: '🧩', title: 'DSA with JavaScript — Complete', domain: 'All', type: 'Practice', level: 'Intermediate', duration: '35h', url: '#' },
  { _id: 6, icon: '🐳', title: 'DevOps & Kubernetes Bootcamp', domain: 'DevOps', type: 'Course', level: 'Advanced', duration: '30h', url: '#' },
  { _id: 7, icon: '🎨', title: 'Modern UI/UX Design Principles', domain: 'UI/UX Design', type: 'Guide', level: 'Beginner', duration: '18h', url: '#' },
  { _id: 8, icon: '☁️', title: 'AWS Cloud Practitioner Prep', domain: 'Cloud Computing', type: 'Course', level: 'Beginner', duration: '22h', url: '#' },
  { _id: 9, icon: '📱', title: 'Flutter Mobile App Development', domain: 'Mobile Development', type: 'Course', level: 'Intermediate', duration: '28h', url: '#' },
  { _id: 10, icon: '🔢', title: 'Quantitative Aptitude Mastery', domain: 'Aptitude', type: 'Practice', level: 'Beginner', duration: '12h', url: '#' },
  { _id: 11, icon: '🧠', title: 'Machine Learning A-Z', domain: 'Machine Learning', type: 'Course', level: 'Intermediate', duration: '45h', url: '#' },
  { _id: 12, icon: '🔒', title: 'Cybersecurity Fundamentals', domain: 'Cybersecurity', type: 'Course', level: 'Beginner', duration: '20h', url: '#' },
];

const DOMAINS = ['All', 'Frontend Development', 'Backend Development', 'Data Science', 'Machine Learning', 'DevOps', 'Mobile Development', 'Cloud Computing', 'UI/UX Design', 'Aptitude'];

export function StudyMaterialsPage() {
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = materials.filter(m => {
    const domainMatch = filter === 'All' || m.domain === filter || m.domain === 'All';
    const typeMatch = typeFilter === 'All' || m.type === typeFilter;
    const searchMatch = !search || m.title.toLowerCase().includes(search.toLowerCase());
    return domainMatch && typeMatch && searchMatch;
  });

  const levelColor = { Beginner: 'green', Intermediate: 'amber', Advanced: 'red' };

  return (
    <div className="anim-fade-in">
      <PageHeader title="Study Materials" subtitle="Curated learning resources for internship and placement preparation" />

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <input className="form-input" placeholder="⌕ Search materials…" style={{ width: 260 }}
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="form-select" style={{ width: 160 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {['All', 'Course', 'Guide', 'Practice', 'Video', 'PDF'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DOMAINS.map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className="btn btn-sm"
              style={{ background: filter === d ? 'rgba(0,229,255,.1)' : 'var(--surface)', color: filter === d ? 'var(--cyan)' : 'var(--text2)', border: `1px solid ${filter === d ? 'var(--cyan)' : 'var(--border)'}` }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>{filtered.length} materials found</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {filtered.map(m => (
          <div key={m._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{m.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.4, flex: 1 }}>{m.title}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <Badge type="violet">{m.type}</Badge>
              <Badge type={levelColor[m.level]}>{m.level}</Badge>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
              🕐 {m.duration} · {m.domain}
            </div>
            <a href={m.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary btn-sm btn-full">Start Learning →</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialsPage;
