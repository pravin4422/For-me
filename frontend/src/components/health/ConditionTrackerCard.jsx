import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine
} from 'recharts';
import { Plus, ChevronDown, ChevronUp, Paperclip, AlertTriangle, CheckCircle, Minus } from 'lucide-react';
import './ConditionTrackerCard.css';

const PALETTE = ['#5f59f7', '#44c2fd', '#6592fd', '#8c61ff', '#343090'];
const VIEWS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

function statusInfo(value, range) {
  if (!range || value === undefined || value === null) return null;
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  if (v >= range.low && v <= range.high) return { label: 'In Range',    color: '#44c2fd', icon: <CheckCircle size={12} /> };
  if (v < range.low * 0.9 || v > range.high * 1.1) return { label: 'Out of Range', color: '#8c61ff', icon: <AlertTriangle size={12} /> };
  return { label: 'Borderline', color: '#6592fd', icon: <Minus size={12} /> };
}

export default function ConditionTrackerCard({ condition, onUpdate }) {
  const [view, setView]           = useState('Weekly');
  const [showDiet, setShowDiet]   = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [logValues, setLogValues] = useState({});
  const [logNote,   setLogNote]   = useState('');
  const [mealName,  setMealName]  = useState('');
  const [mealCal,   setMealCal]   = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [uploadName, setUploadName] = useState('');

  const { name, color = '#5f59f7', metrics = [], logs = [], dietGuide = {}, nextCheckup } = condition;

  const addLog = () => {
    const hasValue = metrics.some(m => logValues[m.key]);
    if (!hasValue) return;
    const entry = {
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...logValues,
      note: logNote,
    };
    onUpdate(condition.id, { logs: [entry, ...logs] });
    setLogValues({}); setLogNote('');
  };

  const addMeal = () => {
    if (!mealName) return;
    const flagged = (dietGuide.avoid || []).some(f =>
      mealName.toLowerCase().includes(f.toLowerCase())
    );
    const entry = { name: mealName, cal: parseInt(mealCal) || 0, carbs: parseInt(mealCarbs) || 0, flagged };
    onUpdate(condition.id, { conditionMeals: [entry, ...(condition.conditionMeals || [])] });
    setMealName(''); setMealCal(''); setMealCarbs('');
  };

  const mockUpload = () => {
    if (!uploadName) return;
    onUpdate(condition.id, {
      labReports: [
        { name: uploadName, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
        ...(condition.labReports || [])
      ]
    });
    setUploadName('');
  };

  // Build chart data filtered by view
  const chartLogs = [...logs].reverse().slice(0, view === 'Daily' ? 7 : view === 'Weekly' ? 7 : view === 'Monthly' ? 30 : 52);
  const chartData = chartLogs.map(l => {
    const pt = { date: l.date };
    metrics.forEach(m => { pt[m.key] = parseFloat(l[m.key]) || null; });
    return pt;
  });

  const latestLog = logs[0];

  return (
    <div className="ctc" style={{ '--ctc-color': color }}>
      {/* Header */}
      <div className="ctc-header">
        <div className="ctc-title-row">
          <span className="ctc-dot" style={{ background: color }} />
          <span className="ctc-name">{name}</span>
          {nextCheckup && (
            <span className="ctc-checkup-badge">Next checkup: {nextCheckup}</span>
          )}
        </div>
        {/* Latest reading status badges */}
        {latestLog && (
          <div className="ctc-status-row">
            {metrics.map(m => {
              const st = statusInfo(latestLog[m.key], m.range);
              return st ? (
                <span key={m.key} className="ctc-status-badge" style={{ color: st.color, background: `${st.color}14` }}>
                  {st.icon} {m.label}: {latestLog[m.key]} {m.unit} — {st.label}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Log form */}
      <div className="ctc-log-form">
        <div className="ctc-log-fields">
          {metrics.map(m => (
            <div key={m.key} className="ctc-field-wrap">
              <label className="ctc-field-label">{m.label} {m.unit && <span>({m.unit})</span>}</label>
              <input className="ctc-input" type="number" placeholder={m.placeholder || '—'}
                value={logValues[m.key] || ''}
                onChange={e => setLogValues(p => ({ ...p, [m.key]: e.target.value }))} />
              {m.range && (
                <span className="ctc-range-hint">Normal: {m.range.low}–{m.range.high}</span>
              )}
            </div>
          ))}
          <div className="ctc-field-wrap ctc-field-wrap--note">
            <label className="ctc-field-label">Notes</label>
            <input className="ctc-input" type="text" placeholder="Optional notes"
              value={logNote} onChange={e => setLogNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLog()} />
          </div>
        </div>
        <button className="ctc-log-btn" style={{ background: color }} onClick={addLog}>
          <Plus size={14} /> Log Reading
        </button>
      </div>

      {/* Trend chart */}
      <div className="ctc-chart-section">
        <div className="ctc-view-tabs">
          {VIEWS.map(v => (
            <button key={v} className={`ctc-view-tab ${view === v ? 'ctc-view-tab--active' : ''}`}
              style={view === v ? { background: color, color: '#fff', borderColor: color } : {}}
              onClick={() => setView(v)}>{v}</button>
          ))}
        </div>
        {chartData.length === 0 ? (
          <p className="ctc-empty-chart">No readings yet — log one above.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 6, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }}
                labelStyle={{ fontWeight: 700, color: 'var(--text-heading)' }}
              />
              {metrics.map((m, i) => (
                <Line key={m.key} type="monotone" dataKey={m.key} name={m.label}
                  stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              ))}
              {metrics.map(m => m.range && [
                <ReferenceLine key={`lo-${m.key}`} y={m.range.low}  stroke="#44c2fd" strokeDasharray="4 3" strokeWidth={1} />,
                <ReferenceLine key={`hi-${m.key}`} y={m.range.high} stroke="#8c61ff" strokeDasharray="4 3" strokeWidth={1} />,
              ])}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Readings table toggle */}
      <button className="ctc-toggle-btn" onClick={() => setShowTable(t => !t)}>
        {showTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showTable ? 'Hide' : 'Show'} readings table
      </button>

      {showTable && (
        <div className="ctc-table-wrap">
          {logs.length === 0 ? (
            <p className="ctc-empty-chart">No readings logged yet.</p>
          ) : (
            <table className="ctc-table">
              <thead>
                <tr>
                  <th>Date</th><th>Time</th>
                  {metrics.map(m => <th key={m.key}>{m.label}</th>)}
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 20).map((l, i) => (
                  <tr key={i}>
                    <td>{l.date}</td><td>{l.time}</td>
                    {metrics.map(m => {
                      const st = statusInfo(l[m.key], m.range);
                      return (
                        <td key={m.key} style={st ? { color: st.color, fontWeight: 700 } : {}}>
                          {l[m.key] ?? '—'}
                        </td>
                      );
                    })}
                    <td className="ctc-table-note">{l.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Diet & Food Guide toggle */}
      <button className="ctc-toggle-btn" onClick={() => setShowDiet(d => !d)}>
        {showDiet ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showDiet ? 'Hide' : 'Show'} Diet & Food Guide
      </button>

      {showDiet && (
        <div className="ctc-diet">
          <div className="ctc-diet-cols">
            <div className="ctc-diet-col ctc-diet-col--eat">
              <span className="ctc-diet-heading" style={{ color: '#44c2fd' }}>Recommended</span>
              <ul>{(dietGuide.eat || []).map((f, i) => <li key={i}>{f}</li>)}</ul>
            </div>
            <div className="ctc-diet-col ctc-diet-col--avoid">
              <span className="ctc-diet-heading" style={{ color: '#8c61ff' }}>Avoid</span>
              <ul>{(dietGuide.avoid || []).map((f, i) => <li key={i}>{f}</li>)}</ul>
            </div>
          </div>

          {/* Condition-specific food log */}
          <div className="ctc-meal-log">
            <span className="ctc-diet-heading" style={{ color: '#5f59f7' }}>Food Log</span>
            <div className="ctc-log-fields ctc-log-fields--meal">
              <input className="ctc-input" type="text" placeholder="Food / meal name"
                value={mealName} onChange={e => setMealName(e.target.value)} />
              <input className="ctc-input ctc-input--sm" type="number" placeholder="kcal"
                value={mealCal} onChange={e => setMealCal(e.target.value)} />
              <input className="ctc-input ctc-input--sm" type="number" placeholder="Carbs g"
                value={mealCarbs} onChange={e => setMealCarbs(e.target.value)} />
              <button className="ctc-log-btn" style={{ background: '#5f59f7' }} onClick={addMeal}>
                <Plus size={13} /> Add
              </button>
            </div>
            {(condition.conditionMeals || []).length > 0 && (
              <ul className="ctc-meal-list">
                {(condition.conditionMeals || []).map((m, i) => (
                  <li key={i} className={`ctc-meal-item ${m.flagged ? 'ctc-meal-item--flagged' : ''}`}>
                    <span className="ctc-meal-name">{m.name}</span>
                    {m.cal > 0 && <span className="ctc-meal-stat">{m.cal} kcal</span>}
                    {m.carbs > 0 && <span className="ctc-meal-stat">{m.carbs}g carbs</span>}
                    {m.flagged && <span className="ctc-meal-flag"><AlertTriangle size={11} /> Avoid list</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Lab report mock upload */}
          <div className="ctc-lab-upload">
            <span className="ctc-diet-heading" style={{ color: '#343090' }}>Lab Reports</span>
            <div className="ctc-log-fields">
              <input className="ctc-input" type="text" placeholder="Report name (e.g. HbA1c Jun 2025)"
                value={uploadName} onChange={e => setUploadName(e.target.value)} />
              <button className="ctc-log-btn" style={{ background: '#343090' }} onClick={mockUpload}>
                <Paperclip size={13} /> Attach
              </button>
            </div>
            {(condition.labReports || []).length > 0 && (
              <ul className="ctc-lab-list">
                {(condition.labReports || []).map((r, i) => (
                  <li key={i} className="ctc-lab-item">
                    <Paperclip size={12} style={{ color: '#343090' }} />
                    <span>{r.name}</span>
                    <span className="ctc-lab-date">{r.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
