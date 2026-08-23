import { useState } from 'react';
import {
  Droplets, Moon, Footprints, Dumbbell, Flame, Plus, Check,
  Utensils, TrendingUp, TrendingDown, ClipboardList, Stethoscope, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from 'recharts';
import HealthTrackerCard from '../../components/health/HealthTrackerCard';
import ConditionTrackerCard from '../../components/health/ConditionTrackerCard';
import './HealthPage.css';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

const WATER_GOAL  = 8;
const SLEEP_GOAL  = 8;
const STEPS_GOAL  = 10000;
const CAL_GOAL    = 2000;

const MOCK_7DAY = [
  { day: 'Mon', water: 6,   sleep: 7,   calories: 1850 },
  { day: 'Tue', water: 7,   sleep: 6.5, calories: 2100 },
  { day: 'Wed', water: 5,   sleep: 8,   calories: 1780 },
  { day: 'Thu', water: 8,   sleep: 7.5, calories: 2200 },
  { day: 'Fri', water: 6.5, sleep: 6,   calories: 1950 },
  { day: 'Sat', water: 7,   sleep: 9,   calories: 2300 },
  { day: 'Today', water: null, sleep: null, calories: null },
];

const YESTERDAY_CAL = 1880;

const INIT_CONDITIONS = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    color: '#5f59f7',
    nextCheckup: '15 Jul 2025',
    metrics: [
      { key: 'fasting',  label: 'Fasting Sugar',   unit: 'mg/dL', placeholder: 'e.g. 95',  range: { low: 70,  high: 100 } },
      { key: 'postmeal', label: 'Post-meal Sugar',  unit: 'mg/dL', placeholder: 'e.g. 130', range: { low: 70,  high: 140 } },
      { key: 'hba1c',    label: 'HbA1c',            unit: '%',     placeholder: 'e.g. 5.8',  range: { low: 4,   high: 5.7 } },
    ],
    logs: [
      { date: '01 Jun', time: '08:00 AM', fasting: 92,  postmeal: 128, hba1c: '',   note: 'Morning reading' },
      { date: '03 Jun', time: '08:15 AM', fasting: 98,  postmeal: 135, hba1c: '',   note: '' },
      { date: '05 Jun', time: '07:50 AM', fasting: 88,  postmeal: 122, hba1c: '',   note: 'After walk' },
      { date: '08 Jun', time: '08:00 AM', fasting: 105, postmeal: 148, hba1c: '',   note: 'Skipped dinner' },
      { date: '10 Jun', time: '08:30 AM', fasting: 94,  postmeal: 130, hba1c: 5.8,  note: 'Lab test' },
      { date: '12 Jun', time: '08:00 AM', fasting: 90,  postmeal: 125, hba1c: '',   note: '' },
      { date: '15 Jun', time: '08:10 AM', fasting: 96,  postmeal: 132, hba1c: '',   note: '' },
    ],
    dietGuide: {
      eat:   ['Leafy greens', 'Whole grains', 'Legumes', 'Nuts & seeds', 'Berries', 'Fish', 'Eggs'],
      avoid: ['White rice', 'Sugary drinks', 'White bread', 'Sweets', 'Fried foods', 'Alcohol'],
    },
    conditionMeals: [
      { name: 'Brown rice + dal', cal: 320, carbs: 52, flagged: false },
      { name: 'Sugary tea',       cal: 80,  carbs: 18, flagged: true  },
    ],
    labReports: [
      { name: 'HbA1c Report Jun 2025', date: '10 Jun 2025' },
    ],
  },
];

function SummaryRing({ pct, color }) {
  const r = 22, cx = 28, cy = 28, stroke = 4;
  const circ = 2 * Math.PI * r;
  return (
    <div className="summary-ring-wrap">
      <svg width="56" height="56">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <span className="summary-ring-pct" style={{ color }}>{Math.round(pct * 100)}%</span>
    </div>
  );
}

export default function HealthPage() {
  // Part 1 state
  const [water, setWater]     = useState(5);
  const [sleep, setSleep]     = useState(6.5);
  const [steps, setSteps]     = useState(7200);
  const [workouts, setWorkouts] = useState([{ type: 'Running', duration: 30 }]);

  const [waterInput, setWaterInput] = useState('');
  const [sleepInput, setSleepInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [workoutDur,  setWorkoutDur]  = useState('');

  // Part 2 state
  const [meals, setMeals]       = useState([
    { name: 'Oats + Banana', protein: 12, notes: 'Breakfast' },
    { name: 'Grilled Chicken Rice', protein: 38, notes: 'Lunch' },
  ]);
  const [mealName,    setMealName]    = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealNotes,   setMealNotes]   = useState('');

  const [calories, setCalories]     = useState(1640);
  const [calInput,  setCalInput]     = useState('');

  // Checklist (auto-derived + manual)
  const [extraDone, setExtraDone] = useState({ stretch: false, noJunk: false, vitamins: false });

  // Part 3 — Medical Conditions
  const [conditions, setConditions] = useState(INIT_CONDITIONS);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [newCondName, setNewCondName] = useState('');
  const [newCondColor, setNewCondColor] = useState('#5f59f7');

  const updateCondition = (id, patch) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const addCondition = () => {
    if (!newCondName.trim()) return;
    setConditions(prev => [...prev, {
      id: Date.now().toString(),
      name: newCondName.trim(),
      color: newCondColor,
      metrics: [],
      logs: [],
      dietGuide: { eat: [], avoid: [] },
      conditionMeals: [],
      labReports: [],
    }]);
    setNewCondName(''); setShowAddCondition(false);
  };

  const waterMet   = water >= WATER_GOAL;
  const sleepMet   = sleep >= SLEEP_GOAL;
  const workoutMet = workouts.length > 0;
  const stepsMet   = steps >= STEPS_GOAL;
  const calMet     = calories <= CAL_GOAL;

  // Handlers
  const addWater   = () => { const v = parseFloat(waterInput);  if (v > 0) { setWater(w => +(w + v).toFixed(1)); setWaterInput(''); } };
  const addSleep   = () => { const v = parseFloat(sleepInput);  if (v > 0) { setSleep(+(v).toFixed(1)); setSleepInput(''); } };
  const addSteps   = () => { const v = parseInt(stepsInput);    if (v > 0) { setSteps(s => s + v); setStepsInput(''); } };
  const addWorkout = () => {
    if (workoutType && workoutDur) {
      setWorkouts(w => [...w, { type: workoutType, duration: parseInt(workoutDur) }]);
      setWorkoutType(''); setWorkoutDur('');
    }
  };
  const addMeal = () => {
    if (mealName) {
      setMeals(m => [...m, { name: mealName, protein: parseInt(mealProtein) || 0, notes: mealNotes }]);
      setMealName(''); setMealProtein(''); setMealNotes('');
    }
  };
  const addCalories = () => {
    const v = parseInt(calInput);
    if (v > 0) { setCalories(c => c + v); setCalInput(''); }
  };

  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);
  const calDelta     = calories - YESTERDAY_CAL;
  const calPct       = Math.min(calories / CAL_GOAL, 1);

  // 7-day data with today filled in
  const chartData = MOCK_7DAY.map(d =>
    d.day === 'Today' ? { ...d, water, sleep, calories } : d
  );

  const summary = [
    { label: 'Water',    value: `${water}/${WATER_GOAL} gl`,          pct: Math.min(water / WATER_GOAL, 1),   color: '#44c2fd', icon: <Droplets size={14} /> },
    { label: 'Sleep',    value: `${sleep}/${SLEEP_GOAL} hr`,          pct: Math.min(sleep / SLEEP_GOAL, 1),   color: '#8c61ff', icon: <Moon size={14} /> },
    { label: 'Steps',    value: `${(steps/1000).toFixed(1)}k / 10k`,  pct: Math.min(steps / STEPS_GOAL, 1),  color: '#6592fd', icon: <Footprints size={14} /> },
    { label: 'Calories', value: `${calories} / ${CAL_GOAL} kcal`,     pct: calPct,                            color: '#5f59f7', icon: <Flame size={14} /> },
  ];

  const checklist = [
    { key: 'water',   label: 'Water goal met (8 glasses)',   done: waterMet },
    { key: 'sleep',   label: 'Sleep goal met (8 hrs)',       done: sleepMet },
    { key: 'workout', label: 'Workout logged',               done: workoutMet },
    { key: 'steps',   label: 'Steps goal met (10k)',         done: stepsMet },
    { key: 'cal',     label: 'Calories within goal',         done: calMet },
    { key: 'stretch', label: 'Morning stretch / yoga',       done: extraDone.stretch,  manual: true },
    { key: 'noJunk',  label: 'No junk food today',           done: extraDone.noJunk,   manual: true },
    { key: 'vitamins',label: 'Vitamins / supplements taken', done: extraDone.vitamins, manual: true },
  ];
  const doneCount = checklist.filter(c => c.done).length;

  return (
    <div className="health-page">
      {/* Header */}
      <div className="health-header">
        <div>
          <h1 className="health-title">Health</h1>
          <p className="health-date">{todayLabel}</p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="health-summary-strip">
        {summary.map(item => (
          <div className="summary-badge" key={item.label}>
            <SummaryRing pct={item.pct} color={item.color} />
            <div className="summary-badge-info">
              <span className="summary-badge-icon" style={{ color: item.color }}>{item.icon}</span>
              <span className="summary-badge-label">{item.label}</span>
              <span className="summary-badge-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Part 1 Grid */}
      <div className="health-grid">
        <HealthTrackerCard icon={<Droplets size={20} />} iconColor="#44c2fd"
          label="Water Intake" value={`${water} glasses`} goal={`${WATER_GOAL} glasses`}
          pct={Math.min(water / WATER_GOAL, 1)} ringColor="#44c2fd" isEmpty={water === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0.5" step="0.5"
              placeholder="Glasses (e.g. 1)" value={waterInput}
              onChange={e => setWaterInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWater()} />
            <button className="htc-add-btn" style={{ background: '#44c2fd' }} onClick={addWater}><Plus size={14} /> Add</button>
          </div>
          <div className="htc-quick-btns">
            {[0.5, 1, 2].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#44c2fd', color: '#44c2fd' }}
                onClick={() => setWater(w => +(w + v).toFixed(1))}>+{v} gl</button>
            ))}
          </div>
        </HealthTrackerCard>

        <HealthTrackerCard icon={<Moon size={20} />} iconColor="#8c61ff"
          label="Sleep" value={`${sleep} hrs`} goal={`${SLEEP_GOAL} hrs`}
          pct={Math.min(sleep / SLEEP_GOAL, 1)} ringColor="#8c61ff" isEmpty={sleep === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0" max="24" step="0.5"
              placeholder="Hours slept (e.g. 7.5)" value={sleepInput}
              onChange={e => setSleepInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSleep()} />
            <button className="htc-add-btn" style={{ background: '#8c61ff' }} onClick={addSleep}><Check size={14} /> Set</button>
          </div>
          <div className="htc-quick-btns">
            {[6, 7, 7.5, 8].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#8c61ff', color: '#8c61ff' }}
                onClick={() => setSleep(v)}>{v}h</button>
            ))}
          </div>
        </HealthTrackerCard>

        <HealthTrackerCard icon={<Footprints size={20} />} iconColor="#6592fd"
          label="Steps" value={`${steps.toLocaleString()} steps`} goal={`${STEPS_GOAL.toLocaleString()} steps`}
          pct={Math.min(steps / STEPS_GOAL, 1)} ringColor="#6592fd" isEmpty={steps === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0" step="100"
              placeholder="Steps (e.g. 1000)" value={stepsInput}
              onChange={e => setStepsInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSteps()} />
            <button className="htc-add-btn" style={{ background: '#6592fd' }} onClick={addSteps}><Plus size={14} /> Add</button>
          </div>
          <div className="htc-quick-btns">
            {[500, 1000, 2000, 5000].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#6592fd', color: '#6592fd' }}
                onClick={() => setSteps(s => s + v)}>+{v >= 1000 ? `${v/1000}k` : v}</button>
            ))}
          </div>
        </HealthTrackerCard>

        <HealthTrackerCard icon={<Dumbbell size={20} />} iconColor="#5f59f7"
          label="Workout"
          value={workouts.length > 0 ? `${workouts.length} session${workouts.length > 1 ? 's' : ''}` : '—'}
          goal="Daily activity"
          pct={Math.min(workouts.length / 2, 1)} ringColor="#5f59f7" isEmpty={workouts.length === 0}>
          <div className="htc-log-row htc-log-row--workout">
            <input className="htc-input" type="text" placeholder="Type (e.g. Running)"
              value={workoutType} onChange={e => setWorkoutType(e.target.value)} />
            <input className="htc-input htc-input--sm" type="number" min="1" placeholder="Min"
              value={workoutDur} onChange={e => setWorkoutDur(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWorkout()} />
            <button className="htc-add-btn" style={{ background: '#5f59f7' }} onClick={addWorkout}><Plus size={14} /> Log</button>
          </div>
          {workouts.length > 0 && (
            <ul className="workout-log-list">
              {workouts.map((w, i) => (
                <li key={i} className="workout-log-item">
                  <span className="workout-dot" style={{ background: '#5f59f7' }} />
                  <span className="workout-type">{w.type}</span>
                  <span className="workout-dur">{w.duration} min</span>
                </li>
              ))}
            </ul>
          )}
        </HealthTrackerCard>
      </div>

      {/* Part 2 Grid */}
      <div className="health-grid">
        {/* Food / Nutrition */}
        <HealthTrackerCard icon={<Utensils size={20} />} iconColor="#6592fd"
          label="Food / Nutrition"
          value={meals.length > 0 ? `${meals.length} meal${meals.length > 1 ? 's' : ''} · ${totalProtein}g protein` : '—'}
          goal="Balanced meals"
          pct={Math.min(totalProtein / 100, 1)} ringColor="#6592fd" isEmpty={meals.length === 0}>
          <div className="htc-log-row htc-log-row--workout">
            <input className="htc-input" type="text" placeholder="Meal name"
              value={mealName} onChange={e => setMealName(e.target.value)} />
            <input className="htc-input htc-input--sm" type="number" min="0" placeholder="Protein g"
              value={mealProtein} onChange={e => setMealProtein(e.target.value)} />
            <input className="htc-input" type="text" placeholder="Notes (optional)"
              value={mealNotes} onChange={e => setMealNotes(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMeal()} />
            <button className="htc-add-btn" style={{ background: '#6592fd' }} onClick={addMeal}><Plus size={14} /> Add</button>
          </div>
          {meals.length > 0 && (
            <ul className="workout-log-list">
              {meals.map((m, i) => (
                <li key={i} className="workout-log-item">
                  <span className="workout-dot" style={{ background: '#6592fd' }} />
                  <span className="workout-type">{m.name}</span>
                  {m.protein > 0 && <span className="workout-dur">{m.protein}g protein</span>}
                  {m.notes && <span className="meal-note">{m.notes}</span>}
                </li>
              ))}
            </ul>
          )}
        </HealthTrackerCard>

        {/* Calories */}
        <HealthTrackerCard icon={<Flame size={20} />} iconColor="#5f59f7"
          label="Calories"
          value={`${calories.toLocaleString()} kcal`}
          goal={`${CAL_GOAL.toLocaleString()} kcal`}
          pct={calPct} ringColor="#5f59f7" isEmpty={calories === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0" step="50"
              placeholder="Add kcal (e.g. 350)" value={calInput}
              onChange={e => setCalInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCalories()} />
            <button className="htc-add-btn" style={{ background: '#5f59f7' }} onClick={addCalories}><Plus size={14} /> Add</button>
          </div>
          <div className="htc-quick-btns">
            {[100, 200, 300, 500].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#5f59f7', color: '#5f59f7' }}
                onClick={() => setCalories(c => c + v)}>+{v}</button>
            ))}
          </div>
          <div className={`cal-delta ${calDelta > 0 ? 'cal-delta--up' : 'cal-delta--down'}`}>
            {calDelta > 0
              ? <TrendingUp size={13} />
              : <TrendingDown size={13} />}
            <span>{calDelta > 0 ? '+' : ''}{calDelta} kcal vs yesterday ({YESTERDAY_CAL} kcal)</span>
          </div>
        </HealthTrackerCard>
      </div>

      {/* Daily Checklist */}
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
              onClick={() => item.manual && setExtraDone(p => ({ ...p, [item.key]: !p[item.key] }))}>
              <span className={`checklist-box ${item.done ? 'checklist-box--checked' : ''}`}>
                {item.done && <Check size={11} />}
              </span>
              <span className="checklist-label">{item.label}</span>
              {item.manual && <span className="checklist-manual">tap to toggle</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Medical Conditions & Checkups */}
      <div className="health-section-card">
        <div className="health-section-header">
          <span className="health-section-icon" style={{ color: '#343090', background: '#34309018' }}><Stethoscope size={18} /></span>
          <span className="health-section-title">Medical Conditions &amp; Checkups</span>
          <button className="htc-add-btn" style={{ background: '#343090' }}
            onClick={() => setShowAddCondition(s => !s)}>
            <Plus size={13} /> Add Condition
          </button>
        </div>

        {/* Upcoming checkups summary */}
        {conditions.length > 0 && (
          <div className="medical-checkup-strip">
            {conditions.filter(c => c.nextCheckup).map(c => (
              <div key={c.id} className="medical-checkup-badge" style={{ borderColor: c.color }}>
                <Activity size={13} style={{ color: c.color }} />
                <span className="medical-checkup-name">{c.name}</span>
                <span className="medical-checkup-date" style={{ color: c.color }}>{c.nextCheckup}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add condition form */}
        {showAddCondition && (
          <div className="medical-add-form">
            <input className="htc-input" type="text" placeholder="Condition name (e.g. Blood Pressure)"
              value={newCondName} onChange={e => setNewCondName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCondition()} />
            <div className="medical-color-row">
              {['#5f59f7','#44c2fd','#6592fd','#8c61ff','#343090'].map(col => (
                <button key={col} className={`medical-color-dot ${newCondColor === col ? 'medical-color-dot--active' : ''}`}
                  style={{ background: col }} onClick={() => setNewCondColor(col)} />
              ))}
            </div>
            <button className="htc-add-btn" style={{ background: '#343090' }} onClick={addCondition}>
              <Plus size={13} /> Save
            </button>
          </div>
        )}

        {/* Empty state */}
        {conditions.length === 0 && (
          <p className="ctc-empty-chart">No conditions tracked yet — add one above.</p>
        )}

        {/* Condition cards */}
        <div className="medical-conditions-list">
          {conditions.map(c => (
            <ConditionTrackerCard key={c.id} condition={c} onUpdate={updateCondition} />
          ))}
        </div>
      </div>

      {/* 7-Day Trends */}
      <div className="health-section-card">
        <div className="health-section-header">
          <span className="health-section-icon" style={{ color: '#5f59f7', background: '#5f59f718' }}><TrendingUp size={18} /></span>
          <span className="health-section-title">7-Day Trends</span>
        </div>
        <div className="trends-chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ fontWeight: 700, color: 'var(--text-heading)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line type="monotone" dataKey="water"    name="Water (gl)"    stroke="#44c2fd" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              <Line type="monotone" dataKey="sleep"    name="Sleep (hr)"    stroke="#8c61ff" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              <Line type="monotone" dataKey="calories" name="Calories /100" stroke="#5f59f7" strokeWidth={2} dot={{ r: 3 }}
                connectNulls formatter={v => v ? (v / 100).toFixed(1) : null} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="trends-note">Calories shown as ÷100 for scale. Mock data for Mon–Sat; today reflects live input.</p>
      </div>
    </div>
  );
}
