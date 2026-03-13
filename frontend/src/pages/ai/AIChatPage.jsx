// ─── AIChatPage.jsx ───────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../utils/api';
import { PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

const SUGGESTED = [
  'What tech career path suits me?',
  'Give me a 6-month learning roadmap for React',
  'How do I improve my GitHub profile for jobs?',
  'What skills are most in-demand in 2025?',
  'How to prepare for product company interviews?',
  'Should I prioritize DSA or projects?',
];

function MarkdownText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div>
      {text.split('\n').map((line, li) => (
        <div key={li} style={{ marginBottom: line === '' ? 8 : 0 }}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={pi}>{part.slice(2, -2)}</strong>
              : part
          )}
        </div>
      ))}
    </div>
  );
}

export function AIChatPage() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello! I'm your AI Career Advisor powered by advanced AI. I can help you with career advice, learning roadmaps, skill development, interview prep, and more. What would you like to explore today? 🚀",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = [...messages, userMsg].slice(-12).map(m => ({ role: m.role, content: m.content }));
      const res = await aiAPI.chat(history);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      const errMsg = err.response?.status === 429 ? "I'm a bit busy right now. Please try again in a moment." : "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxHeight: 800 }}>
      <PageHeader title="AI Career Chatbot" subtitle="Get instant AI-powered career guidance and advice" />

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role === 'user' ? 'user' : ''}`}>
              {msg.role === 'assistant' ? (
                <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg,var(--cyan),var(--violet2))', color: '#000', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>✦</div>
              ) : (
                <div className="avatar avatar-sm avatar-violet" style={{ flexShrink: 0 }}>U</div>
              )}
              <div className={`bubble ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                {msg.role === 'assistant' ? <MarkdownText text={msg.content} /> : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg-row">
              <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg,var(--cyan),var(--violet2))', color: '#000', fontWeight: 800, fontSize: 12 }}>✦</div>
              <div className="bubble ai" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 12, borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
            {SUGGESTED.map(q => (
              <button key={q} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }} onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="form-input" placeholder="Ask me anything about your career…" value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} />
          <button className="btn btn-primary btn-icon" onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: '10px 16px', fontSize: 18 }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ResumeAnalyzerPage.jsx ───────────────────────────────────────────────────
export function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!resumeText.trim()) return toast.error('Please paste your resume text');
    setLoading(true);
    try {
      const res = await aiAPI.analyzeResume({ resumeText, targetRole });
      setResult(res.data.analysis);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="anim-fade-in">
      <PageHeader title="AI Resume Analyzer" subtitle="Paste your resume and get instant ATS score & improvement tips" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Your Resume</div>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Target Role (optional)</label>
            <input className="form-input" placeholder="e.g. Frontend Developer" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
          </div>
          <textarea className="form-textarea" style={{ minHeight: 320, marginBottom: 16 }}
            placeholder="Paste your full resume text here…&#10;&#10;Name, contact info, education, experience, skills, projects…"
            value={resumeText} onChange={e => setResumeText(e.target.value)} />
          <button className="btn btn-primary btn-full" onClick={analyze} disabled={loading || !resumeText.trim()}>
            {loading ? '✦ Analyzing with AI…' : '✦ Analyze Resume'}
          </button>
        </div>

        <div>
          {!result && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Ready to Analyze</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>Paste your resume and click Analyze to get AI-powered feedback</div>
            </div>
          )}
          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16, display: 'inline-block' }} className="spin">⚙</div>
              <div style={{ fontWeight: 600 }}>AI is analyzing your resume…</div>
              <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 8 }}>This takes 10–15 seconds</div>
            </div>
          )}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Scores */}
              <div className="card" style={{ display: 'flex', justifyContent: 'space-around', padding: 24 }}>
                {[
                  { val: result.atsScore || 0, label: 'ATS Score', color: 'var(--cyan)' },
                  { val: result.jobReadiness || 0, label: 'Job Readiness', color: 'var(--violet2)' },
                ].map(({ val, label, color }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 40, fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{label} / 100</div>
                  </div>
                ))}
              </div>
              {/* Missing Keywords */}
              {result.missingKeywords?.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 700, color: 'var(--red)', marginBottom: 10 }}>⚠ Missing Keywords</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.missingKeywords.map(k => <span key={k} className="badge badge-red">+ {k}</span>)}
                  </div>
                </div>
              )}
              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 700, color: 'var(--amber)', marginBottom: 10 }}>📝 Improvements</div>
                  {result.improvements.map((imp, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--amber)', flexShrink: 0 }}>→</span><span>{imp}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 10 }}>✓ Strengths</div>
                  {result.strengths.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--green)' }}>✓</span><span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {result.summary && (
                <div className="card" style={{ background: 'rgba(0,229,255,.04)', borderColor: 'rgba(0,229,255,.2)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>AI Summary</div>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65 }}>{result.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MockInterviewPage.jsx ────────────────────────────────────────────────────
export function MockInterviewPage() {
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('Entry Level');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  const DOMAINS = ['Frontend Developer','Backend Developer','Full Stack Developer','Data Scientist','ML/AI Engineer','DevOps Engineer','Android Developer','iOS Developer','UI/UX Designer'];

  const generate = async () => {
    if (!domain) return toast.error('Please select a domain');
    setLoading(true);
    try {
      const res = await aiAPI.mockInterview({ domain, level, count: 8 });
      setQuestions(res.data.questions);
      setCurrentQ(0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally { setLoading(false); }
  };

  const diffColor = { Easy: 'green', Medium: 'amber', Hard: 'red' };

  return (
    <div className="anim-fade-in">
      <PageHeader title="AI Mock Interview" subtitle="Practice domain-specific questions with AI-powered feedback" />

      {!questions ? (
        <div className="card" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎤</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Start Mock Interview</div>
          <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 14 }}>
            Choose your target domain and experience level to get AI-generated interview questions tailored for you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left', marginBottom: 24 }}>
            <div className="form-group">
              <label className="form-label">Target Domain *</label>
              <select className="form-select" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="">Select domain…</option>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select className="form-select" value={level} onChange={e => setLevel(e.target.value)}>
                <option>Entry Level</option><option>Mid Level</option><option>Senior Level</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary btn-full" onClick={generate} disabled={loading || !domain} style={{ padding: 14 }}>
            {loading ? '⏳ Generating questions…' : '✦ Generate Interview Questions'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
          <div>
            <div className="card" style={{ padding: '14px 18px', marginBottom: 14, background: 'rgba(0,229,255,.04)', borderColor: 'rgba(0,229,255,.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>🎤 {domain} · {level}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{currentQ + 1} / {questions.length}</div>
              </div>
              <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 99 }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--cyan),var(--violet2))', borderRadius: 99, width: `${((currentQ + 1) / questions.length) * 100}%`, transition: 'width .4s' }} />
              </div>
            </div>

            {questions.map((q, i) => (
              <div key={i} className={`card`} style={{ marginBottom: 8, cursor: 'pointer', border: `1px solid ${currentQ === i ? 'var(--cyan)' : 'var(--border)'}`, background: currentQ === i ? 'rgba(0,229,255,.04)' : 'var(--surface)' }}
                onClick={() => setCurrentQ(i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)' }}>Q{i + 1}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`badge badge-${diffColor[q.difficulty] || 'amber'}`}>{q.difficulty}</span>
                    <span className="badge badge-violet">{q.type}</span>
                  </div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: currentQ === i ? 'var(--text)' : 'var(--text2)' }}>{q.question}</div>
              </div>
            ))}

            <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }} onClick={() => setQuestions(null)}>← Try Another Domain</button>
          </div>

          {/* Tips panel */}
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, marginBottom: 16 }}>💡 How to Answer</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, lineHeight: 1.5 }}>{questions[currentQ]?.question}</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className={`badge badge-${diffColor[questions[currentQ]?.difficulty] || 'amber'}`}>{questions[currentQ]?.difficulty}</span>
                <span className="badge badge-violet">{questions[currentQ]?.type}</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>
              <strong style={{ color: 'var(--cyan)' }}>Tips:</strong><br />
              {questions[currentQ]?.tips || 'Think out loud, explain your reasoning, and mention trade-offs.'}
            </div>
            {questions[currentQ]?.expectedAnswer && (
              <div style={{ background: 'var(--bg2)', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--text2)', border: '1px solid var(--border)', marginBottom: 16, lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--green)' }}>Key Points:</strong><br />
                {questions[currentQ].expectedAnswer}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>← Prev</button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))} disabled={currentQ === questions.length - 1}>Next →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CareerRoadmapPage.jsx ────────────────────────────────────────────────────
export function CareerRoadmapPage() {
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('6 months');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim()) return toast.error('Please enter your career goal');
    setLoading(true);
    try {
      const res = await aiAPI.careerRoadmap({ goal, timeframe });
      setRoadmap(res.data.roadmap);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Roadmap generation failed');
    } finally { setLoading(false); }
  };

  const statusColors = { current: 'var(--cyan)', done: 'var(--green)', upcoming: 'var(--text3)' };

  return (
    <div className="anim-fade-in">
      <PageHeader title="AI Career Roadmap" subtitle="Get a personalized step-by-step learning roadmap for your career goal" />

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input className="form-input" style={{ flex: 1, minWidth: 240 }}
            placeholder="Your career goal (e.g. Full Stack Developer, Data Scientist…)"
            value={goal} onChange={e => setGoal(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} />
          <select className="form-select" style={{ width: 140 }} value={timeframe} onChange={e => setTimeframe(e.target.value)}>
            <option>3 months</option><option>6 months</option><option>1 year</option>
          </select>
          <button className="btn btn-primary" onClick={generate} disabled={loading || !goal.trim()} style={{ whiteSpace: 'nowrap' }}>
            {loading ? '⏳ Generating…' : '✦ Generate Roadmap'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 40, marginBottom: 16, display: 'inline-block' }} className="spin">✦</div>
          <div style={{ fontWeight: 600 }}>Creating your personalized roadmap…</div>
          <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 8 }}>AI is analyzing your goal and building phases</div>
        </div>
      )}

      {roadmap && (
        <div>
          <div className="card" style={{ padding: '14px 20px', marginBottom: 20, background: 'rgba(0,229,255,.04)', borderColor: 'rgba(0,229,255,.2)' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18 }}>🗺️ {roadmap.goal}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
              {roadmap.totalDuration} · {roadmap.phases?.length} phases
              {roadmap.salaryRange && ` · Fresher: ${roadmap.salaryRange.fresher} LPA`}
            </div>
          </div>

          {roadmap.phases?.map((phase, i) => (
            <div key={i} className="card" style={{ marginBottom: 14, borderLeft: `3px solid ${statusColors[phase.status] || 'var(--border2)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>{phase.duration}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18 }}>
                    Phase {phase.phase}: {phase.title}
                  </div>
                </div>
                <span className={`badge badge-${phase.status === 'current' ? 'cyan' : phase.status === 'done' ? 'green' : 'amber'}`}>
                  {phase.status || 'Upcoming'}
                </span>
              </div>

              {phase.skills?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Skills to Learn</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {phase.skills.map(s => <span key={s} className="badge badge-cyan">⚡ {s}</span>)}
                  </div>
                </div>
              )}

              {phase.projects?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Projects</div>
                  {phase.projects.map((p, pi) => (
                    <div key={pi} style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>🔨 {p}</div>
                  ))}
                </div>
              )}

              {phase.resources?.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Resources</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {phase.resources.map((r, ri) => (
                      <span key={ri} className="badge badge-violet">📚 {r.name || r}</span>
                    ))}
                  </div>
                </div>
              )}

              {phase.milestone && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(16,185,129,.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,.2)', fontSize: 13, color: 'var(--green)' }}>
                  🎯 Milestone: {phase.milestone}
                </div>
              )}
            </div>
          ))}

          {(roadmap.certifications?.length > 0 || roadmap.topCompanies?.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
              {roadmap.certifications?.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>🎓 Recommended Certifications</div>
                  {roadmap.certifications.map((c, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>• {c}</div>)}
                </div>
              )}
              {roadmap.topCompanies?.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>🏢 Target Companies</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {roadmap.topCompanies.map((c, i) => <span key={i} className="badge badge-violet">{c}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIChatPage;
