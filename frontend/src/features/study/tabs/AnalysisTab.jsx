import { useState, useEffect } from 'react';
import { BarChart2, CalendarDays, RotateCcw, PenLine, ClipboardList } from 'lucide-react';
import * as api from '../../../api/study/plannerApi';
import './AnalysisTab.css';

// ── SVG Pie Chart ─────────────────────────────────────────────────────────────
function PieChart({ done, total }) {
  const undone = total - done;
  if (total === 0) {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="18" />
        <text x="60" y="65" textAnchor="middle" fontSize="13" fill="var(--text-muted)">No data</text>
      </svg>
    );
  }

  const r = 50;
  const cx = 60, cy = 60;

  if (done === total) {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--accent)" strokeWidth="18" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--accent)">{done}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--text-muted)">All done</text>
      </svg>
    );
  }

  if (done === 0) {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth="18" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill="#ef4444">{undone}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--text-muted)">Pending</text>
      </svg>
    );
  }

  const pct = done / total;
  const angle = pct * 2 * Math.PI;
  const x1 = cx + r * Math.sin(0);
  const y1 = cy - r * Math.cos(0);
  const x2 = cx + r * Math.sin(angle);
  const y2 = cy - r * Math.cos(angle);
  const large = angle > Math.PI ? 1 : 0;

  const dDone   = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  const dUndone = `M ${cx} ${cy} L ${x2} ${y2} A ${r} ${r} 0 ${1 - large} 1 ${x1} ${y1} Z`;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <path d={dUndone} fill="#ef4444" opacity="0.7" />
      <path d={dDone}   fill="var(--accent)" />
      <circle cx={cx} cy={cy} r="28" fill="var(--bg-surface)" />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--text-heading)">{Math.round(pct * 100)}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--text-muted)">done</text>
    </svg>
  );
}

// ── Single section card ───────────────────────────────────────────────────────
function SectionCard({ label, icon, type }) {
  const [folders, setFolders]       = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [items, setItems]           = useState([]);
  const [loadingF, setLoadingF]     = useState(true);
  const [loadingI, setLoadingI]     = useState(false);

  useEffect(() => {
    setLoadingF(true);
    api.getPlans(null, type)
      .then(r => {
        setFolders(r.data.data);
        if (r.data.data.length > 0) setSelectedId(r.data.data[0]._id);
      })
      .catch(() => {})
      .finally(() => setLoadingF(false));
  }, [type]);

  useEffect(() => {
    if (!selectedId) { setItems([]); return; }
    setLoadingI(true);
    api.getItems(selectedId)
      .then(r => setItems(r.data.data))
      .catch(() => {})
      .finally(() => setLoadingI(false));
  }, [selectedId]);

  const done  = items.filter(i => i.completed).length;
  const total = items.length;

  return (
    <div className="analysis-card">
      <div className="analysis-card__header">
        {icon}
        <span className="analysis-card__title">{label}</span>
      </div>

      {loadingF ? (
        <div className="tab-loading" style={{ padding: '20px 0' }}>Loading…</div>
      ) : folders.length === 0 ? (
        <p className="planner-empty-hint">No folders yet.</p>
      ) : (
        <>
          <select
            className="select-input analysis-card__select"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            {folders.map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>

          <div className="analysis-card__body">
            <PieChart done={done} total={total} />

            <div className="analysis-card__stats">
              <div className="analysis-stat analysis-stat--done">
                <span className="analysis-stat__count">{done}</span>
                <span className="analysis-stat__label">Completed</span>
              </div>
              <div className="analysis-stat analysis-stat--undone">
                <span className="analysis-stat__count">{total - done}</span>
                <span className="analysis-stat__label">Pending</span>
              </div>
              <div className="analysis-stat">
                <span className="analysis-stat__count">{total}</span>
                <span className="analysis-stat__label">Total</span>
              </div>
            </div>
          </div>

          {loadingI ? (
            <div className="tab-loading" style={{ padding: '12px 0' }}>Loading topics…</div>
          ) : items.length === 0 ? (
            <p className="planner-empty-hint">No topics in this folder.</p>
          ) : (
            <ul className="analysis-topic-list">
              {items.map(item => (
                <li key={item._id} className={`analysis-topic ${item.completed ? 'analysis-topic--done' : ''}`}>
                  <span className={`analysis-topic__dot ${item.completed ? 'analysis-topic__dot--done' : ''}`} />
                  <span className="analysis-topic__text">{item.text}</span>
                  <span className="analysis-topic__status">{item.completed ? 'Done' : 'Pending'}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { label: 'Study Planner',    type: 'planner',   icon: <CalendarDays size={16} /> },
  { label: 'Revision Tracker', type: 'revision',  icon: <RotateCcw size={16} /> },
  { label: 'Practice',         type: 'practice',  icon: <PenLine size={16} /> },
  { label: 'Mock Tests',       type: 'mock-test', icon: <ClipboardList size={16} /> },
];

export default function AnalysisTab() {
  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <BarChart2 size={18} />
          <h2>Analysis</h2>
        </div>
      </div>

      <div className="analysis-grid">
        {SECTIONS.map(s => (
          <SectionCard key={s.type} label={s.label} icon={s.icon} type={s.type} />
        ))}
      </div>
    </div>
  );
}
