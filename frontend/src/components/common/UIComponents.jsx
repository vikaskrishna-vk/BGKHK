// ─── SCORE RING ───────────────────────────────────────────────────────────────
export const ScoreRing = ({ value = 0, max = 100, color = 'var(--cyan)', size = 120, label }) => {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const fill = Math.min((value / max), 1) * circ;
  return (
    <div className="score-ring-container">
      <div className="score-ring-wrap" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface2)" strokeWidth="8" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }} />
        </svg>
        <div className="score-ring-text">
          <span style={{ fontFamily: 'Syne,sans-serif', fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: size * 0.10, color: 'var(--text3)' }}>/{max}</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center' }}>{label}</span>}
    </div>
  );
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ value = 0, height = 6, color }) => (
  <div className="progress-track" style={{ height }}>
    <div className="progress-fill" style={{
      width: `${Math.min(value, 100)}%`,
      background: color || undefined,
    }} />
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, change, icon, iconBg = 'rgba(0,229,255,.12)', iconColor = 'var(--cyan)', trend = 'up' }) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        {icon}
      </div>
      {change && (
        <span style={{ fontSize: 12, color: trend === 'up' ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </span>
      )}
    </div>
    <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
  </div>
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, type = 'cyan' }) => (
  <span className={`badge badge-${type}`}>{children}</span>
);

// ─── LOADING SPINNER ──────────────────────────────────────────────────────────
export const Spinner = ({ size = 24 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `2px solid var(--border2)`,
    borderTopColor: 'var(--cyan)',
    animation: 'spin .7s linear infinite',
    display: 'inline-block',
  }} />
);

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
    <div>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: 'var(--text2)' }}>{subtitle}</p>}
    </div>
    {children && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{children}</div>}
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 560 }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} style={{ fontSize: 16 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📭', title = 'Nothing here', desc, action }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
    {desc && <div style={{ fontSize: 14, maxWidth: 320 }}>{desc}</div>}
    {action}
  </div>
);

// ─── SHIMMER PLACEHOLDER ──────────────────────────────────────────────────────
export const ShimmerCard = ({ height = 120 }) => (
  <div className="shimmer" style={{ height, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
);

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export const Timeline = ({ items }) => (
  <div className="timeline">
    {items.map((item, i) => (
      <div className="timeline-item" key={i}>
        <div className="timeline-dot">{item.icon || '●'}</div>
        <div className="timeline-content">
          <div className="timeline-title">{item.title}</div>
          {item.sub && <div className="timeline-sub">{item.sub}</div>}
          {item.extra && <div style={{ marginTop: 6 }}>{item.extra}</div>}
        </div>
      </div>
    ))}
  </div>
);

// ─── SKILL PILL ───────────────────────────────────────────────────────────────
export const SkillPill = ({ skill, selected, onClick }) => (
  <span className={`skill-pill ${selected ? 'selected' : ''}`} onClick={onClick}>
    {selected ? '✓' : '+'} {skill}
  </span>
);

// ─── TABS ─────────────────────────────────────────────────────────────────────
export const Tabs = ({ tabs, active, onChange }) => (
  <div className="tabs" style={{ marginBottom: 24 }}>
    {tabs.map(tab => (
      <button key={tab.value || tab} className={`tab ${active === (tab.value || tab) ? 'active' : ''}`}
        onClick={() => onChange(tab.value || tab)}>
        {tab.label || tab}
      </button>
    ))}
  </div>
);

// ─── INFO ROW ─────────────────────────────────────────────────────────────────
export const InfoRow = ({ label, value, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
    <span style={{ color: 'var(--text2)' }}>{label}</span>
    <span style={{ fontWeight: 500, color: color || 'var(--text)' }}>{value}</span>
  </div>
);

// ─── SCORE BREAKDOWN ROW ──────────────────────────────────────────────────────
export const ScoreBreakdown = ({ label, value, color = 'var(--cyan)', weight }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
      <span style={{ color: 'var(--text2)' }}>{label}{weight && <span style={{ color: 'var(--text3)', marginLeft: 4 }}>({weight})</span>}</span>
      <span style={{ fontWeight: 700, color }}>{value}</span>
    </div>
    <ProgressBar value={value} color={color} />
  </div>
);
