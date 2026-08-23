import { useState } from 'react';
import { Check, ClipboardList } from 'lucide-react';
import './health.css';

const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const AUTO_ITEMS = [
  { key: 'water',   label: 'Water goal met (8 glasses)' },
  { key: 'sleep',   label: 'Sleep goal met (8 hrs)' },
  { key: 'workout', label: 'Workout logged' },
  { key: 'steps',   label: 'Steps goal met (10k)' },
  { key: 'cal',     label: 'Calories within goal' },
];

const MANUAL_ITEMS = [
  { key: 'stretch',  label: 'Morning stretch / yoga' },
  { key: 'noJunk',   label: 'No junk food today' },
  { key: 'vitamins', label: 'Vitamins / supplements taken' },
];

export default function ChecklistPage() {
  const [manual, setManual] = useState({ stretch: false, noJunk: false, vitamins: false });

  const checklist = [
    ...AUTO_ITEMS.map(i => ({ ...i, done: false, isManual: false })),
    ...MANUAL_ITEMS.map(i => ({ ...i, done: manual[i.key], isManual: true })),
  ];
  const doneCount = checklist.filter(c => c.done).length;

  return (
    <div className="health-page">
      <div className="health-header"><div>
        <h1 className="health-title">Daily Checklist</h1>
        <p className="health-date">{todayLabel}</p>
      </div></div>

      <div className="health-section-card">
        <div className="health-section-header">
          <span className="health-section-icon" style={{ color: '#343090', background: '#34309018' }}><ClipboardList size={18} /></span>
          <span className="health-section-title">Daily Health Checklist</span>
          <span className="checklist-score">{doneCount}/{checklist.length}</span>
        </div>
        <div className="checklist-progress-bar">
          <div className="checklist-progress-fill" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
        </div>
        <ul className="checklist-list">
          {checklist.map(item => (
            <li key={item.key}
              className={`checklist-item ${item.done ? 'checklist-item--done' : ''}`}
              onClick={() => item.isManual && setManual(p => ({ ...p, [item.key]: !p[item.key] }))}>
              <span className={`checklist-box ${item.done ? 'checklist-box--checked' : ''}`}>
                {item.done && <Check size={11} />}
              </span>
              <span className="checklist-label">{item.label}</span>
              {item.isManual && <span className="checklist-manual">tap to toggle</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
