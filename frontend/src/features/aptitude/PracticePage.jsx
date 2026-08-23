import { useState } from 'react';
import { Dumbbell, FlaskConical, BookOpen, X } from 'lucide-react';
import './aptitude.css';

const TOPICS = ['All', 'Percentage', 'Profit & Loss', 'Time & Work', 'Ratio', 'Speed & Distance', 'Algebra', 'Geometry', 'Probability'];

const PRACTICE_SETS = [
  { id: 1, topic: 'Percentage', title: 'Percentage Basics', questions: 20, attempted: 18, correct: 14,
    formula: 'P% = (Part / Whole) × 100', concept: 'Percentage means per hundred. Always calculate on the base value.' },
  { id: 2, topic: 'Percentage', title: 'Successive Changes', questions: 15, attempted: 10, correct: 7,
    formula: 'Net% = a + b + (ab/100)', concept: 'Two successive % changes are NOT additive. Use the combined formula.' },
  { id: 3, topic: 'Profit & Loss', title: 'CP, SP & Profit%', questions: 25, attempted: 20, correct: 17,
    formula: 'P% = [(SP − CP) / CP] × 100', concept: 'Profit/Loss is always on CP. Discount is on Marked Price.' },
  { id: 4, topic: 'Time & Work', title: 'Work Rate Problems', questions: 20, attempted: 12, correct: 9,
    formula: '1/T = 1/A + 1/B', concept: 'Use LCM method. Assume total work = LCM of individual days.' },
  { id: 5, topic: 'Speed & Distance', title: 'Train Problems', questions: 18, attempted: 0, correct: 0,
    formula: 'S = D / T; Relative speed (opp) = S1 + S2', concept: 'For crossing problems, distance = sum of lengths of both trains.' },
  { id: 6, topic: 'Algebra', title: 'Age Problems', questions: 15, attempted: 8, correct: 5,
    formula: 'Set up linear equations from given conditions', concept: '"n years ago" means subtract n from current age.' },
  { id: 7, topic: 'Geometry', title: 'Area & Perimeter', questions: 20, attempted: 5, correct: 4,
    formula: 'Circle: A=πr², Rect: A=l×b, Triangle: A=½bh', concept: 'For shaded region problems, subtract inner area from outer.' },
  { id: 8, topic: 'Probability', title: 'Basic Probability', questions: 12, attempted: 0, correct: 0,
    formula: 'P(E) = n(E) / n(S)', concept: 'Total outcomes for n coins = 2ⁿ, for n dice = 6ⁿ.' },
];

export default function PracticePage() {
  const [topic, setTopic] = useState('All');
  const [panel, setPanel] = useState(null); // { type: 'formula'|'concept', set }

  const filtered = PRACTICE_SETS.filter(s => topic === 'All' || s.topic === topic);

  return (
    <div className="apt-page">
      <div className="apt-header">
        <div className="apt-header__left">
          <div className="apt-header__icon"><Dumbbell size={18} /></div>
          <h1 className="apt-header__title">Practice</h1>
        </div>
      </div>

      <div className="apt-chips">
        {TOPICS.map(t => (
          <button key={t} className={`apt-chip ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}>{t}</button>
        ))}
      </div>

      <div className="apt-practice-layout">
        <div className="apt-practice-list">
          {filtered.map(s => {
            const accuracy = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;
            const progress = Math.round((s.attempted / s.questions) * 100);
            return (
              <div key={s.id} className="apt-practice-card">
                <div className="apt-practice-card__top">
                  <p className="apt-practice-card__title">{s.title}</p>
                  <div className="apt-practice-card__meta">
                    <span className="apt-card__topic-badge">{s.topic}</span>
                    {s.attempted > 0 && (
                      <span className="freq-badge freq-badge--medium">{accuracy}% accuracy</span>
                    )}
                  </div>
                </div>
                <div className="apt-practice-card__progress">
                  <div className="apt-progress-bar">
                    <div className="apt-progress-bar__fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="apt-progress-label">{s.attempted}/{s.questions} attempted</span>
                </div>
                <div className="apt-practice-card__actions">
                  <button className="apt-add-btn" style={{ fontSize: 12, padding: '6px 14px' }}>
                    {s.attempted === 0 ? 'Start Practice' : 'Continue'}
                  </button>
                  <button className="apt-link-btn" onClick={() => setPanel({ type: 'formula', set: s })}>
                    <FlaskConical size={13} /> View Formula
                  </button>
                  <button className="apt-link-btn" onClick={() => setPanel({ type: 'concept', set: s })}>
                    <BookOpen size={13} /> View Concept
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {panel && (
          <div className="apt-side-panel">
            <div className="apt-side-panel__header">
              <p className="apt-side-panel__title">
                {panel.type === 'formula' ? 'Related Formula' : 'Related Concept'}
              </p>
              <button className="apt-card__icon-btn" onClick={() => setPanel(null)}><X size={13} /></button>
            </div>
            <span className="apt-card__topic-badge" style={{ alignSelf: 'flex-start' }}>{panel.set.topic}</span>
            {panel.type === 'formula' ? (
              <>
                <div className="apt-formula-card__expr">{panel.set.formula}</div>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{panel.set.concept}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
