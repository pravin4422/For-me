import { useState, useEffect } from 'react';
import {
  ArrowLeft, Repeat, Clock, AlignLeft,
  CheckCircle2, Circle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getOverview, getHistory, getCalendar, getStreaks, logComplete } from '../../api/todo/index.js';
import './TodoDetail.css';

const isMongoId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CAL_DAYS    = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const ALL_DAYS    = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DAY_SHORT   = { SUN:'Su', MON:'Mo', TUE:'Tu', WED:'We', THU:'Th', FRI:'Fr', SAT:'Sa' };
const DAY_LABELS  = { MON:'Mon', TUE:'Tue', WED:'Wed', THU:'Thu', FRI:'Fri', SAT:'Sat', SUN:'Sun' };
const HISTORY_RANGES = ['week', 'month', 'year'];
const HISTORY_LABELS = { week: 'Week', month: 'Month', year: 'Year' };

function fmtDateTime(str) {
  if (!str) return '';
  return new Date(str).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function fmtStreakDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Overview ───────────────────────────────────────────────
function SectionOverview({ task, mongoId, refreshKey }) {
  const isRecurring = task.taskType === 'RECURRING';
  const fallback = !isRecurring
    ? { taskType: 'ONE_TIME', completed: !!task.completed }
    : { taskType: 'RECURRING', today: { score: 0 }, month: { delta: 0 }, year: { delta: 0 }, totalCompletions: 0 };

  const [data, setData]       = useState(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!mongoId) { setData(fallback); return; }
    setLoading(true); setError(null);
    getOverview(mongoId)
      .then(r => {
        const d = r.data.data;
        setData({ ...d, taskType: d.taskType || (isRecurring ? 'RECURRING' : 'ONE_TIME') });
        setLoading(false);
      })
      .catch(() => { setError('Failed to load overview'); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id, task.completed, mongoId, refreshKey]);

  const effectiveType = data.taskType || (isRecurring ? 'RECURRING' : 'ONE_TIME');

  return (
    <div className="tdd-section tdd-section--overview">
      <span className="tdd-section-label">Overview</span>
      {loading && <div className="tdd-state">Loading…</div>}
      {error   && <div className="tdd-state tdd-state--err">{error}</div>}
      {!loading && !error && effectiveType === 'ONE_TIME' && (
        <div className="tdd-onetime">
          {(data.completed ?? task.completed)
            ? <><CheckCircle2 size={20} className="tdd-onetime--done" /><span>Completed</span></>
            : <><Circle       size={20} className="tdd-onetime--pend" /><span>Not completed</span></>
          }
        </div>
      )}
      {!loading && !error && effectiveType === 'RECURRING' && (
        <div className="tdd-stats">
          <div className="tdd-stat"><span className="tdd-stat-val">{data.today?.score ?? 0}%</span><span className="tdd-stat-lbl">Today</span></div>
          <div className="tdd-stat"><span className="tdd-stat-val">{data.month?.score ?? 0}%</span><span className="tdd-stat-lbl">This Month</span></div>
          <div className="tdd-stat"><span className="tdd-stat-val">{data.year?.score ?? 0}%</span><span className="tdd-stat-lbl">This Year</span></div>
          <div className="tdd-stat"><span className="tdd-stat-val">{data.totalCompletions ?? 0}</span><span className="tdd-stat-lbl">Total</span></div>
        </div>
      )}
    </div>
  );
}

// ── History ────────────────────────────────────────────────
function SectionHistory({ task, mongoId, refreshKey }) {
  const [range, setRange]   = useState('week');
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const isRecurring = task.taskType === 'RECURRING';

  useEffect(() => {
    if (!mongoId || !isRecurring) { setSeries([]); return; }
    setLoading(true); setError(null);
    getHistory(mongoId, range)
      .then(r => { setSeries(r.data.data || []); setLoading(false); })
      .catch(() => { setError('Failed to load history'); setLoading(false); });
  }, [task.id, task.completed, mongoId, range, refreshKey, isRecurring]);

  if (!isRecurring) return null;

  return (
    <div className="tdd-section tdd-section--history">
      <div className="tdd-section-row">
        <span className="tdd-section-label">History</span>
        <div className="tdd-ranges">
          {HISTORY_RANGES.map(r => (
            <button key={r} className={`tdd-range-btn${range === r ? ' active' : ''}`} onClick={() => setRange(r)}>
              {HISTORY_LABELS[r]}
            </button>
          ))}
        </div>
      </div>
      {loading && <div className="tdd-state">Loading…</div>}
      {error   && <div className="tdd-state tdd-state--err">{error}</div>}
      {!loading && !error && !mongoId && <div className="tdd-state">Save task to see history.</div>}
      {!loading && !error && mongoId && series.length === 0 && <div className="tdd-state">No data yet.</div>}
      {!loading && !error && mongoId && series.length > 0 && (
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={series} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={v => [v, 'Completions']}
              contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
              cursor={{ fill: 'rgba(95,89,247,0.08)' }}
            />
            <Bar dataKey="count" fill="#5f59f7" radius={[4,4,0,0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ── Calendar ───────────────────────────────────────────────
function SectionCalendar({ task, mongoId, onLogChange }) {
  const isRecurring = task.taskType === 'RECURRING';
  const [year,  setYear]  = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [logs,  setLogs]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!mongoId || !isRecurring) { setLogs([]); return; }
    setLoading(true); setError(null);
    getCalendar(mongoId, year, month + 1)
      .then(r => { setLogs(r.data.data || []); setLoading(false); })
      .catch(() => { setError('Failed to load calendar'); setLoading(false); });
  }, [task.id, task.completed, mongoId, year, month, isRecurring]);

  const completedSet = new Set(logs.filter(l => l.completed).map(l => new Date(l.date).getUTCDate()));
  const missedSet    = new Set(logs.filter(l => !l.completed).map(l => new Date(l.date).getUTCDate()));

  // use UTC-based first day and days-in-month to match log UTC dates
  const firstDay    = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const nowUTC      = new Date();
  const todayDate   = nowUTC.getUTCFullYear() === year && nowUTC.getUTCMonth() === month
    ? nowUTC.getUTCDate() : -1;
  const isNextDisabled = year === nowUTC.getUTCFullYear() && month === nowUTC.getUTCMonth();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (isNextDisabled) return; if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  const handleDayClick = async (d) => {
    if (!mongoId) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isCompleted = completedSet.has(d);
    setLogs(prev => {
      const existing = prev.find(l => new Date(l.date).getUTCDate() === d);
      if (existing) return prev.map(l => new Date(l.date).getUTCDate() === d ? { ...l, completed: !isCompleted } : l);
      return [...prev, { date: dateStr, completed: true }];
    });
    try {
      await logComplete(mongoId, { date: dateStr, completed: !isCompleted });
      onLogChange();
    } catch {
      setLogs(prev => prev.map(l => new Date(l.date).getUTCDate() === d ? { ...l, completed: isCompleted } : l));
    }
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  if (!isRecurring) return null;

  return (
    <div className="tdd-section tdd-section--calendar">
      <div className="tdd-section-row">
        <span className="tdd-section-label">Calendar</span>
        <div className="tdd-cal-nav">
          <button className="tdd-cal-nav-btn" onClick={prevMonth}>&#8249;</button>
          <span className="tdd-cal-nav-label">{MONTH_NAMES[month]} {year}</span>
          <button className="tdd-cal-nav-btn" onClick={nextMonth} disabled={isNextDisabled}>&#8250;</button>
        </div>
      </div>
      {loading && <div className="tdd-state">Loading…</div>}
      {error   && <div className="tdd-state tdd-state--err">{error}</div>}
      {!loading && !error && (
        <>
          <div className="tdd-cal-grid">
            {CAL_DAYS.map(d => <div key={d} className="tdd-cal-head">{d}</div>)}
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`} className="tdd-cal-cell tdd-cal-cell--empty" />;
              let cls = 'tdd-cal-cell tdd-cal-cell--clickable';
              if (completedSet.has(d))      cls += ' tdd-cal-cell--done';
              else if (missedSet.has(d))    cls += ' tdd-cal-cell--missed';
              if (d === todayDate)          cls += ' tdd-cal-cell--today';
              return <div key={d} className={cls} onClick={() => handleDayClick(d)}>{d}</div>;
            })}
          </div>
          <div className="tdd-cal-legend">
            <span className="tdd-cal-leg-item"><span className="tdd-cal-leg-dot tdd-cal-leg-dot--done" />Completed</span>
            <span className="tdd-cal-leg-item"><span className="tdd-cal-leg-dot tdd-cal-leg-dot--missed" />Missed</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Best Streaks ───────────────────────────────────────────
function SectionStreaks({ task, mongoId, refreshKey }) {
  const isRecurring = task.taskType === 'RECURRING';
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!mongoId || !isRecurring) { setData(null); return; }
    setLoading(true); setError(null);
    getStreaks(mongoId)
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => { setError('Failed to load streaks'); setLoading(false); });
  }, [task.id, task.completed, mongoId, refreshKey, isRecurring]);

  if (!isRecurring) return null;

  return (
    <div className="tdd-section tdd-section--streaks">
      <span className="tdd-section-label">Best Streaks</span>
      {loading && <div className="tdd-state">Loading…</div>}
      {error   && <div className="tdd-state tdd-state--err">{error}</div>}
      {!loading && !error && !mongoId && <div className="tdd-state">Save task to see streaks.</div>}
      {!loading && !error && mongoId && !data && <div className="tdd-state">No streak data yet.</div>}
      {!loading && !error && mongoId && data && data.bestStreak === 0 && (
        <div className="tdd-state">No streaks yet — complete this task consistently to build one.</div>
      )}
      {!loading && !error && mongoId && data && data.bestStreak > 0 && (
        <div className="tdd-streak-wrap">
          <div className="tdd-streak-row">
            <span className="tdd-streak-meta">{fmtStreakDate(data.bestStreakStart)}</span>
            <div className="tdd-streak-bar-track">
              <div className="tdd-streak-bar-fill" style={{ width: data.bestStreak > 0 ? '100%' : '0%' }}>
                <span className="tdd-streak-bar-num">{data.bestStreak}d</span>
              </div>
            </div>
            <span className="tdd-streak-meta tdd-streak-meta--right">{fmtStreakDate(data.bestStreakEnd)}</span>
          </div>
          <div className="tdd-streak-current">
            <span className="tdd-streak-lbl">Current streak</span>
            <span className="tdd-streak-val">{data.currentStreak} day{data.currentStreak !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Frequency ──────────────────────────────────────────────
function SectionFrequency({ task }) {
  if (task.taskType !== 'RECURRING') return null;

  const days = Array.isArray(task.frequencyDays) ? task.frequencyDays : [];
  const activeSet  = new Set(days);
  const isEveryDay = days.length === 0;

  return (
    <div className="tdd-section tdd-section--frequency">
      <span className="tdd-section-label">Frequency</span>
      {isEveryDay && <div className="tdd-state" style={{ textAlign: 'left', padding: '2px 0 6px' }}>Every day</div>}
      <div className="tdd-freq-row">
        {ALL_DAYS.map(d => (
          <div key={d} className={`tdd-freq-dot${isEveryDay || activeSet.has(d) ? ' active' : ''}`}>
            {DAY_SHORT[d]}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────
export default function TodoDetail({ task, onClose }) {
  const mongoId = isMongoId(task._id) ? task._id : null;
  const [refreshKey, setRefreshKey] = useState(0);
  const onLogChange = () => setRefreshKey(k => k + 1);

  const freqText = task.taskType === 'RECURRING' && task.frequencyDays?.length
    ? task.frequencyDays.map(d => DAY_LABELS[d] || d).join(', ')
    : task.taskType === 'RECURRING' ? 'Every day' : 'One-time';

  return (
    <div className="tdd-page">
      <div className="tdd-header">
        <button className="tdd-back" onClick={onClose}><ArrowLeft size={15} /> Back</button>
        <span className="tdd-heading">Task Detail</span>
      </div>

      <p className="tdd-title">{task.title}</p>

      <div className="tdd-rows">
        <div className="tdd-row">
          <Repeat size={13} className="tdd-row-icon" />
          <span className="tdd-row-label">Frequency</span>
          <span className="tdd-row-val">{freqText}</span>
        </div>
        {(task.reminderTime || task.reminder) && (
          <div className="tdd-row">
            <Clock size={13} className="tdd-row-icon" />
            <span className="tdd-row-label">Reminder</span>
            <span className="tdd-row-val">{task.reminderTime || fmtDateTime(task.reminder)}</span>
          </div>
        )}
        <div className="tdd-row" style={{ alignItems: task.description ? 'flex-start' : 'center' }}>
          <AlignLeft size={13} className="tdd-row-icon" />
          <span className="tdd-row-label">Description</span>
          <span className={`tdd-row-val${task.description ? '' : ' tdd-row-empty'}`}>
            {task.description || 'No description'}
          </span>
        </div>
      </div>

      <div className={`tdd-sections-grid${task.taskType === 'RECURRING' ? ' tdd-sections-grid--recurring' : ''}`}>
        <SectionOverview  task={task} mongoId={mongoId} refreshKey={refreshKey} />
        <SectionHistory   task={task} mongoId={mongoId} refreshKey={refreshKey} />
        <SectionCalendar  task={task} mongoId={mongoId} onLogChange={onLogChange} />
        <SectionFrequency task={task} />
        <SectionStreaks   task={task} mongoId={mongoId} refreshKey={refreshKey} />
      </div>
    </div>
  );
}
