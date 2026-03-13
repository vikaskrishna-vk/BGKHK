import { useState } from 'react';
import { testAPI } from '../utils/api';
import { PageHeader, ScoreRing, ProgressBar } from '../components/common/UIComponents';
import toast from 'react-hot-toast';

const TESTS = [
  { id: 'quant', icon: '🔢', title: 'Quantitative Aptitude', questions: 20, time: '30 min', difficulty: 'Medium', desc: 'Numbers, algebra, time & work, percentages' },
  { id: 'logical', icon: '🧩', title: 'Logical Reasoning', questions: 20, time: '25 min', difficulty: 'Medium', desc: 'Patterns, sequences, analogies, puzzles' },
  { id: 'verbal', icon: '📖', title: 'Verbal Ability', questions: 20, time: '20 min', difficulty: 'Easy', desc: 'Grammar, vocabulary, comprehension' },
  { id: 'coding', icon: '💻', title: 'Technical Coding', questions: 5, time: '45 min', difficulty: 'Hard', desc: 'DSA, algorithms, problem solving' },
];

const QUESTIONS = [
  { id: 1, q: 'If a train travels 120 km in 2 hours, what is its speed in km/h?', opts: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], correct: 1 },
  { id: 2, q: 'What comes next? 2, 6, 18, 54, ?', opts: ['108', '126', '162', '216'], correct: 2 },
  { id: 3, q: '15% of 200 equals?', opts: ['25', '30', '35', '40'], correct: 1 },
  { id: 4, q: 'A can do work in 10 days, B in 15 days. Together they complete it in?', opts: ['5 days', '6 days', '7 days', '8 days'], correct: 1 },
  { id: 5, q: 'The next prime number after 11 is?', opts: ['12', '13', '14', '15'], correct: 1 },
  { id: 6, q: 'If 2x + 5 = 15, what is x?', opts: ['4', '5', '6', '7'], correct: 1 },
  { id: 7, q: 'A shopkeeper gives 10% discount on ₹500. Final price?', opts: ['₹400', '₹450', '₹480', '₹490'], correct: 1 },
  { id: 8, q: 'What is the simple interest on ₹1000 at 5% per annum for 2 years?', opts: ['₹50', '₹100', '₹150', '₹200'], correct: 1 },
  { id: 9, q: 'Find the odd one out: 121, 144, 169, 200', opts: ['121', '144', '169', '200'], correct: 3 },
  { id: 10, q: 'A clock shows 3:15. What is the angle between the hands?', opts: ['0°', '7.5°', '15°', '22.5°'], correct: 1 },
];

const diffColor = { Easy: 'var(--green)', Medium: 'var(--amber)', Hard: 'var(--red)' };

export default function AptitudeTestsPage() {
  const [phase, setPhase] = useState('select'); // select | test | result
  const [selectedTest, setSelectedTest] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [saving, setSaving] = useState(false);

  const startTest = (test) => {
    setSelectedTest(test);
    setCurrent(0);
    setAnswers({});
    setMarked({});
    setPhase('test');
  };

  const handleAnswer = (qi, ai) => {
    setAnswers(prev => ({ ...prev, [qi]: ai }));
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 300);
    }
  };

  const submit = async () => {
    setSaving(true);
    const correct = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
    const pct = Math.round((correct / QUESTIONS.length) * 100);
    try {
      await testAPI.submit({
        testType: 'Quantitative',
        domain: selectedTest?.id,
        score: pct,
        totalQuestions: QUESTIONS.length,
        correctAnswers: correct,
        percentage: pct,
        answers: Object.entries(answers).map(([qi, ai]) => ({
          questionId: QUESTIONS[qi]?.id,
          selectedAnswer: ai,
          correctAnswer: QUESTIONS[qi]?.correct,
          isCorrect: ai === QUESTIONS[qi]?.correct,
        })),
      });
    } catch {}
    setSaving(false);
    setPhase('result');
  };

  if (phase === 'select') {
    return (
      <div className="anim-fade-in">
        <PageHeader title="Aptitude Tests" subtitle="Practice quantitative, logical, and verbal reasoning for placements" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, marginBottom: 32 }}>
          {TESTS.map(test => (
            <div key={test.id} className="card card-interactive" onClick={() => startTest(test)}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{test.icon}</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{test.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>{test.desc}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
                <span>📝 {test.questions} questions</span>
                <span>⏱ {test.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: diffColor[test.difficulty] }}>{test.difficulty}</span>
                <button className="btn btn-primary btn-sm">Start Test →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Scores stub */}
        <div className="card">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>📊 Performance History</div>
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text3)', fontSize: 14 }}>
            Take tests to see your performance history here
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const correct = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
    const pct = Math.round((correct / QUESTIONS.length) * 100);
    const grade = pct >= 90 ? '🏆 Excellent!' : pct >= 75 ? '🎉 Great Job!' : pct >= 50 ? '👍 Good Effort!' : '💪 Keep Practicing!';

    return (
      <div className="anim-fade-in">
        <PageHeader title="Test Results" />
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px', marginBottom: 20 }}>
            <ScoreRing value={pct} color={pct >= 75 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'} size={140} />
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginTop: 24, marginBottom: 8 }}>{grade}</div>
            <div style={{ color: 'var(--text2)', marginBottom: 8 }}>
              {correct} / {QUESTIONS.length} correct answers
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 32 }}>{selectedTest?.title}</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setPhase('select')}>← All Tests</button>
              <button className="btn btn-primary" onClick={() => startTest(selectedTest)}>Retry Test</button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Question Breakdown</div>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: answers[i] === q.correct ? 'var(--green)' : 'var(--red)', fontWeight: 700, width: 20 }}>
                    {answers[i] === q.correct ? '✓' : '✗'}
                  </span>
                  <span style={{ color: 'var(--text2)', flex: 1 }}>{q.q}</span>
                </div>
                {answers[i] !== q.correct && (
                  <div style={{ marginLeft: 28, fontSize: 12, color: 'var(--green)' }}>
                    Correct: {q.opts[q.correct]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Test phase
  const q = QUESTIONS[current];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="anim-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800 }}>{selectedTest?.title}</h1>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>Question {current + 1} of {QUESTIONS.length}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('End test?')) submit(); }}>
          End & Submit
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        <div>
          <div style={{ marginBottom: 16 }}>
            <ProgressBar value={((current + 1) / QUESTIONS.length) * 100} />
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: 28 }}>
              <span style={{ color: 'var(--text3)', marginRight: 8 }}>Q{current + 1}.</span>
              {q.q}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.opts.map((opt, i) => (
                <button key={i}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '14px 18px',
                    fontSize: 14,
                    borderColor: answers[current] === i ? 'var(--cyan)' : 'var(--border)',
                    background: answers[current] === i ? 'rgba(0,229,255,.08)' : 'var(--surface)',
                    color: answers[current] === i ? 'var(--cyan)' : 'var(--text)',
                    transition: 'all .15s',
                  }}
                  onClick={() => handleAnswer(current, i)}>
                  <span style={{ width: 28, height: 28, border: '1px solid', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: 13, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Previous</button>
            {current < QUESTIONS.length - 1 ? (
              <button className="btn btn-primary btn-sm" onClick={() => setCurrent(c => c + 1)}>Next →</button>
            ) : (
              <button className="btn btn-success btn-sm" onClick={submit} disabled={saving}>
                {saving ? 'Submitting…' : '✓ Submit Test'}
              </button>
            )}
          </div>
        </div>

        {/* Question navigator */}
        <div className="card" style={{ position: 'sticky', top: 80 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Question Navigator</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {QUESTIONS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{
                  width: 34, height: 34, borderRadius: 8, fontSize: 13, fontWeight: 600,
                  border: `1px solid ${current === i ? 'var(--cyan)' : answers[i] !== undefined ? 'var(--green)' : 'var(--border)'}`,
                  background: current === i ? 'rgba(0,229,255,.12)' : answers[i] !== undefined ? 'rgba(16,185,129,.1)' : 'var(--surface)',
                  color: current === i ? 'var(--cyan)' : answers[i] !== undefined ? 'var(--green)' : 'var(--text2)',
                  cursor: 'pointer',
                }}>
                {i + 1}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(16,185,129,.3)', border: '1px solid var(--green)' }} />
              Answered ({answeredCount})
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--surface2)', border: '1px solid var(--border)' }} />
              Not answered ({QUESTIONS.length - answeredCount})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
