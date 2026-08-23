import { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import './aptitude.css';

const TOPICS = ['All', 'Percentage', 'Time & Work', 'Ratio', 'Profit & Loss', 'Speed & Distance', 'Algebra', 'Number System'];

const SHORTCUTS = [
  { id: 1, topic: 'Percentage', title: 'x% of y = y% of x', explanation: 'Swap percentage and number to simplify calculation.', example: '4% of 75 = 75% of 4 = 3' },
  { id: 2, topic: 'Percentage', title: 'Successive % change', explanation: 'Two successive changes a% and b%: net = a + b + ab/100', example: '+20% then −20% = 20 − 20 − 4 = −4%' },
  { id: 3, topic: 'Time & Work', title: 'LCM method', explanation: 'Assume total work = LCM of days. Find per-day work for each person.', example: 'A=6d, B=4d → LCM=12. A does 2/day, B does 3/day → together 5/day → 12/5 days' },
  { id: 4, topic: 'Ratio', title: 'Componendo-Dividendo', explanation: 'If a/b = c/d then (a+b)/(a−b) = (c+d)/(c−d)', example: 'a/b = 3/2 → (3+2)/(3−2) = 5/1' },
  { id: 5, topic: 'Profit & Loss', title: 'Profit % shortcut', explanation: 'Profit% = (SP − CP)/CP × 100. If CP and SP ratio given, use ratio directly.', example: 'CP:SP = 4:5 → Profit% = 1/4 × 100 = 25%' },
  { id: 6, topic: 'Speed & Distance', title: 'Relative speed', explanation: 'Same direction: subtract speeds. Opposite direction: add speeds.', example: 'Trains 60 & 40 km/h opposite → relative = 100 km/h' },
  { id: 7, topic: 'Number System', title: 'Divisibility by 9', explanation: 'Sum of digits divisible by 9 → number divisible by 9.', example: '729 → 7+2+9=18 → divisible by 9' },
  { id: 8, topic: 'Algebra', title: '(a+b)² shortcut', explanation: 'a² + 2ab + b². Memorise squares 1–30 to apply instantly.', example: '(23)² = (20+3)² = 400+120+9 = 529' },
];

export default function ShortcutsPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');

  const filtered = SHORTCUTS.filter(s =>
    (topic === 'All' || s.topic === topic) &&
    (s.title.toLowerCase().includes(query.toLowerCase()) || s.topic.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="apt-page">
      <div className="apt-header">
        <div className="apt-header__left">
          <div className="apt-header__icon"><Zap size={18} /></div>
          <h1 className="apt-header__title">Shortcuts</h1>
        </div>
        <div className="apt-search">
          <Search size={14} />
          <input placeholder="Search shortcuts…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="apt-chips">
        {TOPICS.map(t => (
          <button key={t} className={`apt-chip ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}>{t}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="apt-empty"><Search size={40} /><p>No shortcuts found.</p></div>
      ) : (
        <div className="apt-grid">
          {filtered.map(s => (
            <div key={s.id} className="apt-card">
              <div className="apt-card__top">
                <p className="apt-card__title">{s.title}</p>
                <span className="apt-card__topic-badge">{s.topic}</span>
              </div>
              <p className="apt-card__body">{s.explanation}</p>
              <p className="apt-card__example">Example: {s.example}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
