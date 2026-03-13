import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🤖', title: 'AI Career Advisor', desc: 'Get 24/7 personalized career guidance, skill gap analysis, and learning roadmaps powered by GPT.', color: 'rgba(0,229,255,.1)', ic: 'var(--cyan)' },
  { icon: '📋', title: 'Internship Tracking', desc: 'Add internships, submit weekly reports, and track your entire journey from application to completion.', color: 'rgba(124,58,237,.1)', ic: 'var(--violet2)' },
  { icon: '🎓', title: 'Certificate Verification', desc: 'Multi-layer certificate validation with AI scanning, mentor approval, and admin verification.', color: 'rgba(236,72,153,.1)', ic: 'var(--pink)' },
  { icon: '📊', title: 'Skill Analytics', desc: 'AI-powered skill scoring with internship performance, test results, mentor feedback, and project scores.', color: 'rgba(16,185,129,.1)', ic: 'var(--green)' },
  { icon: '🎤', title: 'AI Mock Interviews', desc: 'Domain-specific AI-generated questions with evaluation tips and coding challenges.', color: 'rgba(245,158,11,.1)', ic: 'var(--amber)' },
  { icon: '🗺️', title: 'Career Roadmaps', desc: 'Personalized step-by-step roadmaps for your dream tech role with resources and milestones.', color: 'rgba(239,68,68,.1)', ic: 'var(--red)' },
];

const STATS = [['10,000+', 'Students'], ['500+', 'Mentors'], ['95%', 'Placement Rate'], ['50+', 'Companies']];

const TESTIMONIALS = [
  { quote: 'InternAI transformed my internship experience. The AI mock interviews helped me crack my dream company on the first try!', name: 'Arjun Sharma', role: 'SDE @ Google', initials: 'AS' },
  { quote: 'The skill analytics dashboard gave me clear direction. My placement readiness jumped from 52% to 89% in 3 months.', name: 'Priya Patel', role: 'Data Scientist @ Flipkart', initials: 'PP' },
  { quote: 'As a mentor, I love how easy it is to track my students progress and provide timely, impactful feedback.', name: 'Dr. Priya Singh', role: 'Industry Mentor, IIT Bombay', initials: 'PS' }
];

const WORKFLOW = [
  { n: '01', title: 'Create Your Profile', desc: 'Register, choose your domain, and set career goals. Get matched with an industry mentor.' },
  { n: '02', title: 'Track Internships', desc: 'Add internships, submit weekly reports, upload certificates for mentor verification.' },
  { n: '03', title: 'AI-Powered Growth', desc: 'Use AI chatbot, resume analyzer, and mock interviews to accelerate your development.' },
  { n: '04', title: 'Get Placed', desc: 'Showcase your verified portfolio, skill ratings, and placement readiness score to recruiters.' },
];

export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ── HERO ── */}
      <section style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '80px 24px' }} className="grid-bg">
        {/* Orbs */}
        <div className="orb orb-cyan" style={{ width: 600, height: 600, top: '-10%', left: '-5%' }} />
        <div className="orb orb-violet" style={{ width: 700, height: 700, bottom: '-15%', right: '-10%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780, margin: '0 auto' }}>
          <div className="anim-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(0,229,255,.08)', border: '1px solid rgba(0,229,255,.2)', borderRadius: 99, fontSize: 13, fontWeight: 600, color: 'var(--cyan)', marginBottom: 28 }}>
            ✦ AI-Powered Career Platform for Students
          </div>

          <h1 className="anim-fade-up anim-d1" style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(38px,6vw,78px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24 }}>
            Launch Your Tech Career<br />
            with <span className="grad-text">AI Guidance</span>
          </h1>

          <p className="anim-fade-up anim-d2" style={{ fontSize: 'clamp(16px,2vw,19px)', color: 'var(--text2)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            InternAI helps students track internships, build verified skill profiles, prepare for placements, and receive personalized AI career mentorship — all in one platform.
          </p>

          <div className="anim-fade-up anim-d3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
            <Link to="/register">
              <button className="btn btn-primary btn-lg" style={{ gap: 10 }}>
                Get Started Free <span style={{ fontSize: 18 }}>→</span>
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-outline btn-lg">Sign In</button>
            </Link>
          </div>

          {/* Stats */}
          <div className="anim-fade-up anim-d4 card" style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', padding: '28px 40px', maxWidth: 680, margin: '0 auto' }}>
            {STATS.map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div className="grad-text-cv" style={{ fontFamily: 'Syne,sans-serif', fontSize: 30, fontWeight: 800 }}>{val}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: 'var(--bg1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Platform Features</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-1px' }}>
              Everything You Need to <span className="grad-text">Succeed</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 540, margin: '16px auto 0', lineHeight: 1.7 }}>
              A complete ecosystem for student career development from internship tracking to AI-powered placement preparation.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,.3)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color, color: f.ic, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>How It Works</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 20 }}>
              4 Steps to <span className="grad-text">Career Success</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 32 }}>
              Follow our proven framework used by thousands of students to land internships and dream jobs.
            </p>
            <Link to="/register">
              <button className="btn btn-primary">Start Your Journey →</button>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {WORKFLOW.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 48, fontWeight: 800, color: 'var(--border2)', lineHeight: 1, minWidth: 64, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CAPABILITIES ── */}
      <section style={{ background: 'var(--bg1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>AI Capabilities</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 56 }}>
            Powered by <span className="grad-text">Advanced AI</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
            {[
              { icon: '🤖', title: 'Career Chatbot', desc: '24/7 AI career guidance', badge: 'GPT-4' },
              { icon: '📄', title: 'Resume Analyzer', desc: 'ATS optimization + scoring', badge: 'AI Powered' },
              { icon: '🎤', title: 'Mock Interviews', desc: 'Domain-specific prep', badge: 'Interactive' },
              { icon: '🗺️', title: 'Roadmap Generator', desc: 'Personalized 6-month plans', badge: 'Smart' },
              { icon: '⚡', title: 'Skill Scoring', desc: 'Composite AI rating system', badge: 'Analytics' },
              { icon: '🔍', title: 'Fake Detection', desc: 'Internship verification AI', badge: 'Security' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>{item.desc}</div>
                <span className="badge badge-cyan" style={{ fontSize: 11 }}>{item.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Success Stories</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, letterSpacing: '-1px' }}>
              Trusted by <span className="grad-text">Students & Mentors</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ color: 'var(--amber)', fontSize: 18, marginBottom: 16, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar avatar-md avatar-violet" style={{ fontSize: 14 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(0,229,255,.05), rgba(124,58,237,.05))', borderTop: '1px solid var(--border)', padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,50px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 20 }}>
          Ready to Accelerate Your <span className="grad-text">Career?</span>
        </h2>
        <p style={{ fontSize: 17, color: 'var(--text2)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Join 10,000+ students already using InternAI to launch their tech careers.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register"><button className="btn btn-primary btn-lg">Start For Free →</button></Link>
          <Link to="/login"><button className="btn btn-outline btn-lg">Sign In</button></Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800 }} className="grad-text-cv">✦ InternAI</div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>© 2025 InternAI. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text2)' }}>
          {['Privacy', 'Terms', 'Contact', 'Blog'].map(l => <span key={l} style={{ cursor: 'pointer' }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}
