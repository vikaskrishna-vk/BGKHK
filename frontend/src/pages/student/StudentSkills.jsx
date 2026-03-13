// ─── StudentSkills.jsx ────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { skillAPI } from '../../utils/api';
import { ScoreRing, ProgressBar, Badge, PageHeader, SkillPill, ScoreBreakdown } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

const ALL_SKILLS = ['React','Node.js','Python','TypeScript','JavaScript','Java','C++','SQL','MongoDB','PostgreSQL','Django','FastAPI','Flutter','React Native','AWS','Docker','Kubernetes','Git','Figma','TensorFlow','PyTorch','Machine Learning','Data Science','DevOps','GraphQL','REST APIs','System Design','DSA','Linux'];

export function StudentSkills() {
  const [skillRecord, setSkillRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    skillAPI.getMy().then(r => {
      setSkillRecord(r.data.skillRecord);
      setSelectedSkills(r.data.skillRecord?.skills?.map(s => s.name || s) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleSkill = (s) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const saveSkills = async () => {
    setSaving(true);
    try {
      await skillAPI.update({ skills: selectedSkills });
      toast.success('Skills updated!');
    } catch { toast.error('Failed to update skills'); }
    finally { setSaving(false); }
  };

  const recalculate = async () => {
    setRecalculating(true);
    try {
      const r = await skillAPI.recalculate();
      setSkillRecord(prev => ({ ...prev, compositeScore: r.data.score, placementReadiness: r.data.score.placementReadiness }));
      toast.success('Score recalculated!');
    } catch { toast.error('Recalculation failed'); }
    finally { setRecalculating(false); }
  };

  const score = skillRecord?.compositeScore || {};

  return (
    <div className="anim-fade-in">
      <PageHeader title="Skill Analytics" subtitle="Track your skill growth and AI-computed placement readiness">
        <button className="btn btn-ghost btn-sm" onClick={recalculate} disabled={recalculating}>
          {recalculating ? '⏳ Recalculating…' : '↻ Recalculate Score'}
        </button>
      </PageHeader>

      {/* Score rings */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24, padding: '8px 0' }}>
          <ScoreRing value={score.overall || 0} color="var(--cyan)" label="Overall Rating" />
          <ScoreRing value={skillRecord?.placementReadiness || 0} color="var(--violet2)" label="Placement Readiness" />
          <ScoreRing value={score.internshipPerformance || 0} color="var(--green)" label="Internship Score" />
          <ScoreRing value={score.aiTestResults || 0} color="var(--amber)" label="Test Results" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20, marginBottom: 20 }}>
        {/* Score Breakdown */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Score Breakdown</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16, padding: '8px 12px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            Formula: 0.4×Internship + 0.3×AI Tests + 0.2×Mentor + 0.1×Projects
          </div>
          <ScoreBreakdown label="Internship Performance" value={score.internshipPerformance || 0} color="var(--cyan)" weight="40%" />
          <ScoreBreakdown label="AI Test Results" value={score.aiTestResults || 0} color="var(--violet2)" weight="30%" />
          <ScoreBreakdown label="Mentor Feedback" value={score.mentorFeedback || 0} color="var(--green)" weight="20%" />
          <ScoreBreakdown label="Project Score" value={score.projectScore || 0} color="var(--amber)" weight="10%" />
        </div>

        {/* Placement Readiness */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Placement Readiness</div>
          {[
            { label: 'Technical Skills', val: selectedSkills.length * 3, color: 'var(--cyan)' },
            { label: 'Problem Solving', val: score.aiTestResults || 0, color: 'var(--violet2)' },
            { label: 'Communication', val: score.mentorFeedback || 0, color: 'var(--green)' },
            { label: 'Project Experience', val: score.projectScore || 0, color: 'var(--amber)' },
            { label: 'Domain Knowledge', val: score.internshipPerformance || 0, color: 'var(--pink)' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text2)' }}>{label}</span>
                <span style={{ fontWeight: 700, color }}>{Math.min(val, 100)}%</span>
              </div>
              <ProgressBar value={Math.min(val, 100)} color={color} />
            </div>
          ))}
        </div>
      </div>

      {/* Skills Portfolio */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 2 }}>Skills Portfolio</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>{selectedSkills.length} skills selected</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={saveSkills} disabled={saving}>
            {saving ? 'Saving…' : '✓ Save Skills'}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_SKILLS.map(s => (
            <SkillPill key={s} skill={s} selected={selectedSkills.includes(s)} onClick={() => toggleSkill(s)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentSkills;
