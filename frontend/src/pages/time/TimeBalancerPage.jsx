import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Plus, Pencil, Trash2, CheckCircle2, Timer,
  BookOpen, Briefcase, Moon, Dumbbell, Car, MoreHorizontal,
  CalendarDays, TrendingUp, TrendingDown, Minus, LayoutGrid,
  Repeat
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import './TimeBalancerPage.css';
import { getTimeActivities, createTimeActivity, updateTimeActivity, deleteTimeActivity } from '../../api/time/timeActivityApi';

// ── palette ───────────────────────────────────────────────
const C = { indigo:'#343090', violet:'#5f59f7', blue:'#6592fd', sky:'#44c2fd', purple:'#8c61ff' };

// ── categories ────────────────────────────────────────────
const CATEGORIES = [
  { key:'study',    label:'Study',            icon:<BookOpen size={14}/>,       color:C.violet },
  { key:'work',     label:'Work',             icon:<Briefcase size={14}/>,      color:C.blue   },
  { key:'sleep',    label:'Sleep',            icon:<Moon size={14}/>,           color:C.indigo },
  { key:'exercise', label:'Exercise',         icon:<Dumbbell size={14}/>,       color:C.sky    },
  { key:'travel',   label:'Travel',           icon:<Car size={14}/>,            color:C.purple },
  { key:'other',    label:'Other Activities', icon:<MoreHorizontal size={14}/>, color:'#7c6fcd'},
];
const CAT_MAP   = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));
const CAT_COLOR = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));

// ── repeat options ────────────────────────────────────────
const REPEAT_OPTS = [
  { key:'daily',    label:'Every Day' },
  { key:'weekdays', label:'Weekdays (Mon–Fri)' },
  { key:'weekends', label:'Weekends (Sat–Sun)' },
  { key:'weekly',   label:'Weekly Once' },
  { key:'monthly',  label:'Monthly Once' },
  { key:'custom',   label:'Custom Days' },
  { key:'none',     label:'No Repeat' },
];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ── helpers ───────────────────────────────────────────────
const toH      = (h,m) => h + m/60;
const fmtDur   = (h,m) => h>0&&m>0 ? `${h}h ${m}m` : h>0 ? `${h}h` : `${m}m`;
const todayISO   = new Date().toISOString().split('T')[0];
const todayLabel = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
const todayDow   = new Date().getDay(); // 0=Sun
const TT = { background:'#1e1b4b', border:'none', borderRadius:8, fontSize:12 };

// is an activity scheduled for today based on its repeat rule?
function isScheduledToday(act) {
  if (act.repeat === 'daily')    return true;
  if (act.repeat === 'weekdays') return todayDow >= 1 && todayDow <= 5;
  if (act.repeat === 'weekends') return todayDow === 0 || todayDow === 6;
  if (act.repeat === 'weekly')   return act.repeatDay === todayDow;
  if (act.repeat === 'monthly')  return act.repeatDate === new Date().getDate();
  if (act.repeat === 'custom')   return (act.customDays || []).includes(todayDow);
  if (act.repeat === 'none')     return act.startDate === todayISO;
  return false;
}

// ── shared chart component ────────────────────────────────
function TimeBalancerChart({ type, data, xKey }) {
  if (type === 'donut') return (
    <ResponsiveContainer width="100%" height={270}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
          innerRadius={68} outerRadius={108} paddingAngle={3}>
          {data.map(d => <Cell key={d.key} fill={CAT_COLOR[d.key]} />)}
        </Pie>
        <Tooltip formatter={v=>`${v.toFixed(1)}h`} contentStyle={TT}/>
        <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:12}}/>
      </PieChart>
    </ResponsiveContainer>
  );

  if (type === 'bar') return (
    <ResponsiveContainer width="100%" height={270}>
      <BarChart data={data} barSize={9}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)"/>
        <XAxis dataKey={xKey} tick={{fontSize:11,fill:'#aaa'}}/>
        <YAxis tick={{fontSize:11,fill:'#aaa'}} tickFormatter={v=>`${v}h`}/>
        <Tooltip formatter={v=>`${v}h`} contentStyle={TT}/>
        <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:12}}/>
        {CATEGORIES.map(c => <Bar key={c.key} dataKey={c.key} name={c.label} fill={c.color} stackId="a"/>)}
      </BarChart>
    </ResponsiveContainer>
  );

  if (type === 'line') return (
    <ResponsiveContainer width="100%" height={270}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)"/>
        <XAxis dataKey={xKey} tick={{fontSize:11,fill:'#aaa'}}/>
        <YAxis tick={{fontSize:11,fill:'#aaa'}} tickFormatter={v=>`${v}h`}/>
        <Tooltip formatter={v=>`${v}h`} contentStyle={TT}/>
        <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:12}}/>
        {CATEGORIES.map(c => <Line key={c.key} type="monotone" dataKey={c.key} name={c.label} stroke={c.color} strokeWidth={2} dot={{r:3,fill:c.color}}/>)}
      </LineChart>
    </ResponsiveContainer>
  );

  // compare type
  return (
    <ResponsiveContainer width="100%" height={270}>
      <BarChart data={data} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)"/>
        <XAxis dataKey="category" tick={{fontSize:10,fill:'#aaa'}}/>
        <YAxis tick={{fontSize:11,fill:'#aaa'}} tickFormatter={v=>`${v}h`}/>
        <Tooltip formatter={v=>`${v}h`} contentStyle={TT}/>
        <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:12}}/>
        <Bar dataKey="thisWeek" name="This Week" fill={C.violet} radius={[4,4,0,0]}/>
        <Bar dataKey="lastWeek" name="Last Week" fill={C.sky}    radius={[4,4,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── comparison chips ──────────────────────────────────────
function CompareChips({ data }) {
  return (
    <div className="tb-chips">
      {data.map(d => {
        const diff = d.thisWeek - d.lastWeek;
        const same = Math.abs(diff) < 0.1, up = diff > 0;
        return (
          <span key={d.category} className={`tb-chip ${same?'neutral':up?'up':'down'}`}>
            {same ? <Minus size={11}/> : up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
            {d.category}<b>{same?'—':`${up?'+':''}${diff.toFixed(1)}h`}</b>
          </span>
        );
      })}
    </div>
  );
}

// ── activity form (add / edit) ─────────────────────────────
const BLANK_FORM = {
  name:'', category:'study', hours:'', minutes:'',
  repeat:'daily', repeatDay:1, repeatDate:1,
  customDays:[], startDate:todayISO, notes:'',
};

function ActivityForm({ editAct, onSubmit, onCancel }) {
  const [form, setForm] = useState(editAct ? {
    name:       editAct.name,
    category:   editAct.category,
    hours:      String(editAct.hours),
    minutes:    String(editAct.minutes),
    repeat:     editAct.repeat,
    repeatDay:  editAct.repeatDay  ?? 1,
    repeatDate: editAct.repeatDate ?? 1,
    customDays: editAct.customDays ?? [],
    startDate:  editAct.startDate  ?? todayISO,
    notes:      editAct.notes,
  } : { ...BLANK_FORM });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const toggleCustomDay = d => setForm(p => ({
    ...p,
    customDays: p.customDays.includes(d)
      ? p.customDays.filter(x => x !== d)
      : [...p.customDays, d],
  }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      ...form,
      id:         editAct?.id ?? Date.now(),
      hours:      parseInt(form.hours)   || 0,
      minutes:    parseInt(form.minutes) || 0,
      repeatDay:  parseInt(form.repeatDay),
      repeatDate: parseInt(form.repeatDate),
    });
  };

  return (
    <div className="tb-form-card">
      <h4>{editAct ? 'Edit Activity' : 'Add Activity'}</h4>
      <form className="tb-form-grid" onSubmit={handleSubmit}>

        {/* name */}
        <div className="tb-field tb-field-wide">
          <label>Activity Name *</label>
          <input type="text" placeholder="e.g. Morning run, Aptitude study…"
            value={form.name} onChange={set('name')} required />
        </div>

        {/* category */}
        <div className="tb-field">
          <label>Category</label>
          <select value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>

        {/* hours + minutes */}
        <div className="tb-field">
          <label>Hours</label>
          <input type="number" min="0" max="23" placeholder="0"
            value={form.hours} onChange={set('hours')} />
        </div>
        <div className="tb-field">
          <label>Minutes</label>
          <input type="number" min="0" max="59" placeholder="30"
            value={form.minutes} onChange={set('minutes')} />
        </div>

        {/* repeat */}
        <div className="tb-field">
          <label>Repeat</label>
          <select value={form.repeat} onChange={set('repeat')}>
            {REPEAT_OPTS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
        </div>

        {/* weekly — pick day */}
        {form.repeat === 'weekly' && (
          <div className="tb-field">
            <label>On which day?</label>
            <select value={form.repeatDay} onChange={set('repeatDay')}>
              {DAYS_SHORT.map((d,i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
        )}

        {/* monthly — pick date */}
        {form.repeat === 'monthly' && (
          <div className="tb-field">
            <label>On which date?</label>
            <input type="number" min="1" max="31" value={form.repeatDate}
              onChange={set('repeatDate')} />
          </div>
        )}

        {/* none — pick start date */}
        {form.repeat === 'none' && (
          <div className="tb-field">
            <label>Date</label>
            <input type="date" value={form.startDate} onChange={set('startDate')} />
          </div>
        )}

        {/* custom days */}
        {form.repeat === 'custom' && (
          <div className="tb-field tb-field-wide">
            <label>Select Days</label>
            <div className="tb-day-picker">
              {DAYS_SHORT.map((d,i) => (
                <button key={i} type="button"
                  className={`tb-day-btn ${form.customDays.includes(i) ? 'active' : ''}`}
                  onClick={() => toggleCustomDay(i)}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* notes */}
        <div className="tb-field tb-field-wide">
          <label>Notes (optional)</label>
          <input type="text" placeholder="Add a note…"
            value={form.notes} onChange={set('notes')} />
        </div>

        <div className="tb-form-actions">
          <button type="submit" className="tb-btn-primary">
            <CheckCircle2 size={14}/> {editAct ? 'Update' : 'Add Activity'}
          </button>
          <button type="button" className="tb-btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ── repeat badge label ────────────────────────────────────
function repeatLabel(act) {
  if (act.repeat === 'daily')    return 'Every Day';
  if (act.repeat === 'weekdays') return 'Weekdays';
  if (act.repeat === 'weekends') return 'Weekends';
  if (act.repeat === 'weekly')   return `Weekly • ${DAYS_SHORT[act.repeatDay]}`;
  if (act.repeat === 'monthly')  return `Monthly • ${act.repeatDate}`;
  if (act.repeat === 'custom')   return (act.customDays||[]).map(d=>DAYS_SHORT[d]).join(', ');
  if (act.repeat === 'none')     return act.startDate;
  return '';
}

// ── activity list (daily view) ────────────────────────────
function ActivityList({ activities, doneIds, onToggleDone, onEdit, onDelete }) {
  const todayActs = activities.filter(isScheduledToday);
  if (!activities.length) return (
    <div className="tb-empty"><Clock size={30}/><p>No activities yet — add your first activity above</p></div>
  );
  if (!todayActs.length) return (
    <div className="tb-empty"><CalendarDays size={30}/><p>No activities scheduled for today</p></div>
  );
  return (
    <div className="tb-log-groups">
      {todayActs.map(act => {
        const cat  = CAT_MAP[act.category];
        const done = doneIds.includes(act.id);
        return (
          <div key={act.id} className={`tb-act-row ${done ? 'done' : ''}`}>
            <button
              className={`tb-done-btn ${done ? 'checked' : ''}`}
              style={done ? { background: cat.color, borderColor: cat.color } : { borderColor: cat.color }}
              onClick={() => onToggleDone(act)}
            >
              {done && <CheckCircle2 size={14} color="#fff" />}
            </button>
            <span className="tb-act-icon" style={{ color: cat.color }}>{cat.icon}</span>
            <div className="tb-act-info">
              <span className="tb-act-name" style={{ textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}>
                {act.name}
              </span>
              <div className="tb-act-meta">
                <span className="tb-act-dur" style={{ color: cat.color }}>{fmtDur(act.hours, act.minutes)}</span>
                <span className="tb-act-repeat"><Repeat size={10}/> {repeatLabel(act)}</span>
                {act.notes && <span className="tb-act-notes">{act.notes}</span>}
              </div>
            </div>
            <div className="tb-log-actions">
              <button className="tb-icon-btn" onClick={() => onEdit(act)}><Pencil size={13}/></button>
              <button className="tb-icon-btn red" onClick={() => onDelete(act.id)}><Trash2 size={13}/></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── breakdown bars ────────────────────────────────────────
function BreakdownBars({ activities, doneIds }) {
  const doneActs = activities.filter(a => doneIds.includes(a.id));
  const totalH   = doneActs.reduce((s,a) => s + toH(a.hours, a.minutes), 0);
  return (
    <div className="tb-breakdown-list">
      {CATEGORIES.map(c => {
        const hrs = doneActs.filter(a => a.category === c.key).reduce((s,a) => s + toH(a.hours, a.minutes), 0);
        const pct = totalH > 0 ? (hrs / totalH) * 100 : 0;
        return (
          <div key={c.key} className="tb-bd-row">
            <span className="tb-bd-icon" style={{color:c.color}}>{c.icon}</span>
            <span className="tb-bd-label">{c.label}</span>
            <div className="tb-bd-bar-wrap"><div className="tb-bd-bar" style={{width:`${pct}%`,background:c.color}}/></div>
            <span className="tb-bd-pct">{pct.toFixed(0)}%</span>
            <span className="tb-bd-hrs" style={{color:c.color}}>{hrs.toFixed(1)}h</span>
          </div>
        );
      })}
    </div>
  );
}

// ── header band (shared) ──────────────────────────────────
function HeaderBand({ title, subtitle, totalH, doneCount, totalCount, onAdd }) {
  return (
    <div className="tb-header-band">
      <div className="tb-header-left">
        <Clock size={22}/>
        <div>
          <h2>{title}</h2>
          <span className="tb-date">{subtitle}</span>
        </div>
      </div>
      <div className="tb-strip">
        <div className="tb-stat-block">
          <span className="tb-stat-label">Done Today</span>
          <span className="tb-stat-value">{doneCount}/{totalCount}</span>
        </div>
        <div className="tb-strip-div"/>
        <div className="tb-stat-block">
          <span className="tb-stat-label">Time Logged</span>
          <span className="tb-stat-value">{totalH.toFixed(1)}h</span>
        </div>
        <div className="tb-strip-div"/>
        <div className="tb-strip-actions">
          <button className="tb-btn-primary" onClick={onAdd}><Plus size={15}/> Add Activity</button>
        </div>
      </div>
    </div>
  );
}

// ── nav pills (for focused views) ─────────────────────────
function ViewNav({ active }) {
  const navigate = useNavigate();
  const views = [
    { key:'overview',  label:'Overview',   path:'/dashboard/time',              icon:<LayoutGrid size={13}/> },
    { key:'daily',     label:'Daily',      path:'/dashboard/time/daily',        icon:<CalendarDays size={13}/> },
    { key:'weekly',    label:'Weekly',     path:'/dashboard/time/weekly',       icon:<TrendingUp size={13}/> },
    { key:'monthly',   label:'Monthly',    path:'/dashboard/time/monthly',      icon:<TrendingDown size={13}/> },
    { key:'promotodo', label:'Promo Todo', path:'/dashboard/time/promotodo',    icon:<Timer size={13}/> },
  ];
  return (
    <div className="tb-viewnav">
      {views.map(v => (
        <button key={v.key} className={`tb-viewnav-btn ${active===v.key?'active':''}`} onClick={()=>navigate(v.path)}>
          {v.icon}{v.label}
        </button>
      ))}
    </div>
  );
}

// ── static placeholder chart data ───────────────────────
const WEEKLY_DATA = [
  { day:'Mon', study:2, work:4, sleep:7, exercise:1, travel:0.5, other:0 },
  { day:'Tue', study:3, work:5, sleep:7, exercise:0, travel:1,   other:0.5 },
  { day:'Wed', study:2, work:4, sleep:8, exercise:1, travel:0,   other:1 },
  { day:'Thu', study:4, work:3, sleep:7, exercise:1, travel:0.5, other:0 },
  { day:'Fri', study:1, work:6, sleep:7, exercise:0, travel:1,   other:0.5 },
  { day:'Sat', study:3, work:0, sleep:8, exercise:2, travel:1,   other:2 },
  { day:'Sun', study:2, work:0, sleep:9, exercise:1, travel:0,   other:3 },
];
const MONTHLY_DATA = [
  { month:'Jan', study:40, work:80, sleep:180, exercise:20, travel:10, other:15 },
  { month:'Feb', study:50, work:75, sleep:170, exercise:25, travel:12, other:10 },
  { month:'Mar', study:60, work:85, sleep:175, exercise:30, travel:8,  other:12 },
  { month:'Apr', study:55, work:90, sleep:180, exercise:22, travel:15, other:18 },
  { month:'May', study:70, work:88, sleep:178, exercise:28, travel:10, other:14 },
];
const COMPARE_DATA = [
  { category:'Study',    thisWeek:17, lastWeek:14 },
  { category:'Work',     thisWeek:22, lastWeek:25 },
  { category:'Sleep',    thisWeek:53, lastWeek:50 },
  { category:'Exercise', thisWeek:6,  lastWeek:4  },
  { category:'Travel',   thisWeek:4,  lastWeek:5  },
  { category:'Other',    thisWeek:7,  lastWeek:9  },
];

// ── MAIN PAGE ─────────────────────────────────────────────
export default function TimeBalancerPage({ tab }) {
  const [logs,      setLogs]      = useState([]);
  const [doneIds,   setDoneIds]   = useState([]);
  const [showForm,  setShowForm]  = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [chartTab,  setChartTab]  = useState('daily'); // for overview chart switcher

  const todayActs  = logs.filter(isScheduledToday);
  const doneTodayIds = doneIds.filter(id => todayActs.some(a => a.id === id));
  const totalH     = doneTodayIds.reduce((s, id) => {
    const a = todayActs.find(x => x.id === id);
    return s + (a ? toH(a.hours, a.minutes) : 0);
  }, 0);

  const dailyDonut = CATEGORIES.map(c => ({
    name:c.label, key:c.key,
    value:parseFloat(
      todayActs.filter(a => doneTodayIds.includes(a.id) && a.category===c.key)
        .reduce((s,e)=>s+toH(e.hours,e.minutes),0).toFixed(2)
    ),
  })).filter(d=>d.value>0);

  useEffect(() => {
    getTimeActivities()
      .then(r => setLogs(r.data.data.map(a => ({ ...a, id: a._id }))))
      .catch(() => {});
  }, []);

  const openForm  = (entry=null) => { setEditEntry(entry); setShowForm(true); };
  const closeForm = ()           => { setEditEntry(null);  setShowForm(false); };

  const handleSubmit = async (entry) => {
    try {
      if (editEntry) {
        const r = await updateTimeActivity(editEntry._id || editEntry.id, entry);
        const updated = { ...r.data.data, id: r.data.data._id };
        setLogs(p => p.map(x => x.id === updated.id ? updated : x));
      } else {
        const r = await createTimeActivity(entry);
        const created = { ...r.data.data, id: r.data.data._id };
        setLogs(p => [created, ...p]);
      }
    } catch {}
    closeForm();
  };

  const handleDelete = async (id) => {
    try {
      await deleteTimeActivity(id);
      setLogs(p => p.filter(x => x.id !== id));
    } catch {}
  };

  const handleToggleDone = (act) => {
    setDoneIds(p => p.includes(act.id) ? p.filter(x=>x!==act.id) : [...p, act.id]);
  };

  const CHART_TABS = [
    {key:'daily',   label:'Daily'},
    {key:'weekly',  label:'Weekly'},
    {key:'monthly', label:'Monthly'},
    {key:'compare', label:'Comparison'},
  ];

  // ── FOCUSED: Daily ───────────────────────────────────────
  if (tab === 'daily') return (
    <div className="tb-page">
      <HeaderBand title="Daily View" subtitle={todayLabel} totalH={totalH} doneCount={doneTodayIds.length} totalCount={todayActs.length} onAdd={()=>openForm()}/>
      <ViewNav active="daily"/>
      {showForm && <ActivityForm editAct={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}
      <div className="tb-main-grid">
        <div className="tb-card">
          <div className="tb-card-header">
            <CalendarDays size={16} style={{color:C.violet}}/>
            <h3>Today's Log</h3>
            <span className="tb-badge">{todayActs.length} entries</span>
          </div>
          <ActivityList activities={logs} doneIds={doneIds} onToggleDone={handleToggleDone} onEdit={openForm} onDelete={handleDelete}/>
        </div>
        <div className="tb-card">
          <p className="tb-chart-title" style={{marginBottom:12}}>Today's Time Split</p>
          {dailyDonut.length===0
            ? <div className="tb-empty"><Clock size={28}/><p>No time logged yet today — mark activities as done</p></div>
            : <TimeBalancerChart type="donut" data={dailyDonut}/>
          }
        </div>
      </div>
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>Today's Breakdown</h3></div>
        <BreakdownBars activities={logs} doneIds={doneIds}/>
      </div>
    </div>
  );

  // ── FOCUSED: Weekly ──────────────────────────────────────
  if (tab === 'weekly') return (
    <div className="tb-page">
      <HeaderBand title="Weekly View" subtitle="Last 7 days" totalH={totalH} doneCount={doneTodayIds.length} totalCount={todayActs.length} onAdd={()=>openForm()}/>
      <ViewNav active="weekly"/>
      {showForm && <ActivityForm editAct={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>Hours per Category — Last 7 Days</h3></div>
        <TimeBalancerChart type="bar" data={WEEKLY_DATA} xKey="day"/>
      </div>
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>This Week vs Last Week</h3></div>
        <CompareChips data={COMPARE_DATA}/>
        <TimeBalancerChart type="compare" data={COMPARE_DATA}/>
      </div>
      <div className="tb-card">
        <div className="tb-card-header"><CalendarDays size={16} style={{color:C.violet}}/><h3>Today's Log</h3><span className="tb-badge">{todayActs.length} entries</span></div>
        <ActivityList activities={logs} doneIds={doneIds} onToggleDone={handleToggleDone} onEdit={openForm} onDelete={handleDelete}/>
      </div>
    </div>
  );

  // ── FOCUSED: Monthly ─────────────────────────────────────
  if (tab === 'monthly') return (
    <div className="tb-page">
      <HeaderBand title="Monthly View" subtitle="Current month trend" totalH={totalH} doneCount={doneTodayIds.length} totalCount={todayActs.length} onAdd={()=>openForm()}/>
      <ViewNav active="monthly"/>
      {showForm && <ActivityForm editAct={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>Monthly Trend — Hours per Category</h3></div>
        <TimeBalancerChart type="line" data={MONTHLY_DATA} xKey="month"/>
      </div>
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>This Month's Breakdown</h3></div>
        <BreakdownBars activities={logs} doneIds={doneIds}/>
      </div>
    </div>
  );

  // ── OVERVIEW (no tab — clicking "Time Balancer" parent) ──
  return (
    <div className="tb-page">
      <HeaderBand title="Time Balancer" subtitle={todayLabel} totalH={totalH} doneCount={doneTodayIds.length} totalCount={todayActs.length} onAdd={()=>openForm()}/>
      <ViewNav active="overview"/>
      {showForm && <ActivityForm editAct={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}

      {/* stat cards row */}
      <div className="tb-stat-cards">
        {CATEGORIES.map(c => {
          const hrs = todayActs.filter(a=>doneTodayIds.includes(a.id)&&a.category===c.key).reduce((s,e)=>s+toH(e.hours,e.minutes),0);
          return (
            <div key={c.key} className="tb-stat-card" style={{borderTopColor:c.color}}>
              <span className="tb-sc-icon" style={{color:c.color}}>{c.icon}</span>
              <span className="tb-sc-label">{c.label}</span>
              <span className="tb-sc-val" style={{color:c.color}}>{hrs.toFixed(1)}h</span>
            </div>
          );
        })}
      </div>

      {/* main 2-col: log + chart switcher */}
      <div className="tb-main-grid">
        <div className="tb-card">
          <div className="tb-card-header">
            <CalendarDays size={16} style={{color:C.violet}}/>
            <h3>Today's Log</h3>
            <span className="tb-badge">{todayActs.length} entries</span>
          </div>
          <ActivityList activities={logs} doneIds={doneIds} onToggleDone={handleToggleDone} onEdit={openForm} onDelete={handleDelete}/>
        </div>

        <div className="tb-card">
          <div className="tb-chart-tabs">
            {CHART_TABS.map(t => (
              <button key={t.key} className={`tb-chart-tab ${chartTab===t.key?'active':''}`} onClick={()=>setChartTab(t.key)}>{t.label}</button>
            ))}
          </div>
          <div className="tb-chart-body">
            {chartTab==='daily' && (
              <>
                <p className="tb-chart-title">Today's Time Split</p>
                {dailyDonut.length===0
                  ? <div className="tb-empty"><Clock size={28}/><p>No time logged yet today — log your first activity</p></div>
                  : <TimeBalancerChart type="donut" data={dailyDonut}/>
                }
              </>
            )}
            {chartTab==='weekly'  && <><p className="tb-chart-title">Last 7 Days</p><TimeBalancerChart type="bar"  data={WEEKLY_DATA}  xKey="day"/></>}
            {chartTab==='monthly' && <><p className="tb-chart-title">Monthly Trend</p><TimeBalancerChart type="line" data={MONTHLY_DATA} xKey="month"/></>}
            {chartTab==='compare' && <><p className="tb-chart-title">This Week vs Last Week</p><CompareChips data={COMPARE_DATA}/><TimeBalancerChart type="compare" data={COMPARE_DATA}/></>}
          </div>
        </div>
      </div>

      {/* breakdown */}
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>Today's Breakdown</h3></div>
        <BreakdownBars activities={logs} doneIds={doneIds}/>
      </div>
    </div>
  );
}
