import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Clock, Plus, Share2, Pencil, Trash2, CheckCircle2,
  BookOpen, Briefcase, Moon, Dumbbell, Car, MoreHorizontal,
  CalendarDays, TrendingUp, TrendingDown, Minus, LayoutGrid
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import './TimeBalancerPage.css';

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
const CAT_COLOR = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));

// ── mock data ─────────────────────────────────────────────
const INIT_LOGS = [
  { id:1, category:'sleep',    hours:7, minutes:0,  date:'2025-07-22', notes:'Good rest' },
  { id:2, category:'study',    hours:3, minutes:30, date:'2025-07-22', notes:'Aptitude revision' },
  { id:3, category:'exercise', hours:1, minutes:0,  date:'2025-07-22', notes:'Morning run' },
  { id:4, category:'work',     hours:4, minutes:0,  date:'2025-07-22', notes:'Project tasks' },
  { id:5, category:'travel',   hours:0, minutes:45, date:'2025-07-22', notes:'' },
  { id:6, category:'other',    hours:1, minutes:30, date:'2025-07-22', notes:'Leisure' },
];

const WEEKLY_DATA = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i) => ({
  day,
  study:    [3.5,4,2.5,5,3,1.5,2][i],
  work:     [4,4,4,4,4,2,0][i],
  sleep:    [7,6.5,7,7,7,8,8.5][i],
  exercise: [1,0,1,0,1,1.5,2][i],
  travel:   [0.75,0.75,0.75,0.75,0.75,0.5,0][i],
  other:    [1.5,2,1,1,1.5,3,3][i],
}));

const MONTHLY_DATA = ['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((month,i) => ({
  month,
  study:    [80,90,75,100,85,95,105][i],
  work:     [88,80,88,80,88,80,88][i],
  sleep:    [210,200,217,210,217,210,217][i],
  exercise: [20,25,18,28,22,30,26][i],
  travel:   [15,18,12,20,16,14,18][i],
  other:    [30,35,28,40,32,38,42][i],
}));

const THIS_WEEK  = WEEKLY_DATA.reduce((acc,d) => { CATEGORIES.forEach(c => { acc[c.key]=(acc[c.key]||0)+d[c.key]; }); return acc; }, {});
const LAST_WEEK  = { study:18, work:20, sleep:49, exercise:5, travel:3.5, other:14 };
const COMPARE_DATA = CATEGORIES.map(c => ({
  category: c.label,
  thisWeek: parseFloat(THIS_WEEK[c.key].toFixed(1)),
  lastWeek: LAST_WEEK[c.key],
}));

// ── helpers ───────────────────────────────────────────────
const toH    = (h,m) => h + m/60;
const fmtDur = (h,m) => h>0&&m>0 ? `${h}h ${m}m` : h>0 ? `${h}h` : `${m}m`;
const todayISO   = new Date().toISOString().split('T')[0];
const todayLabel = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
const TT = { background:'#1e1b4b', border:'none', borderRadius:8, fontSize:12 };

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

// ── log form ──────────────────────────────────────────────
function LogForm({ editEntry, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    editEntry
      ? { category:editEntry.category, hours:String(editEntry.hours), minutes:String(editEntry.minutes), date:editEntry.date, notes:editEntry.notes }
      : { category:'study', hours:'', minutes:'', date:todayISO, notes:'' }
  );
  const set = k => e => setForm(p => ({ ...p, [k]:e.target.value }));
  return (
    <div className="tb-form-card">
      <h4>{editEntry ? 'Edit Entry' : 'Log Time'}</h4>
      <form className="tb-form-grid" onSubmit={e => { e.preventDefault(); onSubmit({ ...form, id:editEntry?.id??Date.now(), hours:parseInt(form.hours)||0, minutes:parseInt(form.minutes)||0 }); }}>
        <div className="tb-field">
          <label>Category</label>
          <select value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div className="tb-field">
          <label>Hours</label>
          <input type="number" min="0" max="24" placeholder="0" value={form.hours} onChange={set('hours')}/>
        </div>
        <div className="tb-field">
          <label>Minutes</label>
          <input type="number" min="0" max="59" placeholder="0" value={form.minutes} onChange={set('minutes')}/>
        </div>
        <div className="tb-field">
          <label>Date</label>
          <input type="date" value={form.date} onChange={set('date')}/>
        </div>
        <div className="tb-field tb-field-wide">
          <label>Notes (optional)</label>
          <input type="text" placeholder="Add a note…" value={form.notes} onChange={set('notes')}/>
        </div>
        <div className="tb-form-actions">
          <button type="submit" className="tb-btn-primary"><CheckCircle2 size={14}/> {editEntry?'Update':'Save'}</button>
          <button type="button" className="tb-btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ── today's log panel ─────────────────────────────────────
function TodayLog({ logs, onEdit, onDelete }) {
  const grouped = CATEGORIES.map(c => ({ ...c, entries:logs.filter(e=>e.category===c.key) })).filter(g=>g.entries.length);
  if (!logs.length) return (
    <div className="tb-empty"><Clock size={30}/><p>No time logged yet today — log your first activity</p></div>
  );
  return (
    <div className="tb-log-groups">
      {grouped.map(g => {
        const gt = g.entries.reduce((s,e)=>s+toH(e.hours,e.minutes),0);
        return (
          <div key={g.key} className="tb-log-group">
            <div className="tb-group-hdr" style={{borderLeftColor:g.color}}>
              <span style={{color:g.color}}>{g.icon}</span>
              <span className="tb-group-label">{g.label}</span>
              <span className="tb-group-total" style={{color:g.color}}>{fmtDur(Math.floor(gt),Math.round((gt%1)*60))}</span>
            </div>
            {g.entries.map(entry => (
              <div key={entry.id} className="tb-log-row">
                <span className="tb-log-dot" style={{background:g.color}}/>
                <span className="tb-log-dur">{fmtDur(entry.hours,entry.minutes)}</span>
                {entry.notes && <span className="tb-log-notes">{entry.notes}</span>}
                <div className="tb-log-actions">
                  <button className="tb-icon-btn" onClick={()=>onEdit(entry)}><Pencil size={13}/></button>
                  <button className="tb-icon-btn red" onClick={()=>onDelete(entry.id)}><Trash2 size={13}/></button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── breakdown bars ────────────────────────────────────────
function BreakdownBars({ logs }) {
  const totalH = logs.reduce((s,e)=>s+toH(e.hours,e.minutes),0);
  return (
    <div className="tb-breakdown-list">
      {CATEGORIES.map(c => {
        const hrs = logs.filter(e=>e.category===c.key).reduce((s,e)=>s+toH(e.hours,e.minutes),0);
        const pct = totalH>0 ? (hrs/totalH)*100 : 0;
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
function HeaderBand({ title, subtitle, totalH, onLogTime, shared, onShare }) {
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
          <span className="tb-stat-label">Logged Today</span>
          <span className="tb-stat-value">{totalH.toFixed(1)}h</span>
        </div>
        <div className="tb-strip-div"/>
        <div className="tb-stat-block">
          <span className="tb-stat-label">Remaining</span>
          <span className="tb-stat-value">{Math.max(0,24-totalH).toFixed(1)}h</span>
        </div>
        <div className="tb-strip-div"/>
        <div className="tb-strip-actions">
          <button className="tb-btn-primary" onClick={onLogTime}><Plus size={15}/> Log Time</button>
          <button className="tb-btn-ghost" onClick={onShare}>
            {shared ? <><CheckCircle2 size={15}/> Shared!</> : <><Share2 size={15}/> Share</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── nav pills (for focused views) ─────────────────────────
function ViewNav({ active }) {
  const navigate = useNavigate();
  const views = [
    { key:'overview', label:'Overview',  path:'/dashboard/time',         icon:<LayoutGrid size={13}/> },
    { key:'daily',    label:'Daily',     path:'/dashboard/time/daily',   icon:<CalendarDays size={13}/> },
    { key:'weekly',   label:'Weekly',    path:'/dashboard/time/weekly',  icon:<TrendingUp size={13}/> },
    { key:'monthly',  label:'Monthly',   path:'/dashboard/time/monthly', icon:<TrendingDown size={13}/> },
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

// ── MAIN PAGE ─────────────────────────────────────────────
export default function TimeBalancerPage({ tab }) {
  const [logs,      setLogs]      = useState(INIT_LOGS);
  const [showForm,  setShowForm]  = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [shared,    setShared]    = useState(false);
  const [chartTab,  setChartTab]  = useState('daily'); // for overview chart switcher

  const totalH = logs.reduce((s,e)=>s+toH(e.hours,e.minutes),0);

  const dailyDonut = CATEGORIES.map(c => ({
    name:c.label, key:c.key,
    value:parseFloat(logs.filter(e=>e.category===c.key).reduce((s,e)=>s+toH(e.hours,e.minutes),0).toFixed(2)),
  })).filter(d=>d.value>0);

  const openForm  = (entry=null) => { setEditEntry(entry); setShowForm(true); };
  const closeForm = ()           => { setEditEntry(null);  setShowForm(false); };

  const handleSubmit = (entry) => {
    setLogs(p => editEntry ? p.map(x=>x.id===entry.id?entry:x) : [entry,...p]);
    closeForm();
  };
  const handleShare = () => { setShared(true); setTimeout(()=>setShared(false),2500); };

  const CHART_TABS = [
    {key:'daily',   label:'Daily'},
    {key:'weekly',  label:'Weekly'},
    {key:'monthly', label:'Monthly'},
    {key:'compare', label:'Comparison'},
  ];

  // ── FOCUSED: Daily ───────────────────────────────────────
  if (tab === 'daily') return (
    <div className="tb-page">
      <HeaderBand title="Daily View" subtitle={todayLabel} totalH={totalH} onLogTime={()=>openForm()} shared={shared} onShare={handleShare}/>
      <ViewNav active="daily"/>
      {showForm && <LogForm editEntry={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}
      <div className="tb-main-grid">
        <div className="tb-card">
          <div className="tb-card-header">
            <CalendarDays size={16} style={{color:C.violet}}/>
            <h3>Today's Log</h3>
            <span className="tb-badge">{logs.length} entries</span>
          </div>
          <TodayLog logs={logs} onEdit={openForm} onDelete={id=>setLogs(p=>p.filter(x=>x.id!==id))}/>
        </div>
        <div className="tb-card">
          <p className="tb-chart-title" style={{marginBottom:12}}>Today's Time Split</p>
          {dailyDonut.length===0
            ? <div className="tb-empty"><Clock size={28}/><p>No time logged yet today — log your first activity</p></div>
            : <TimeBalancerChart type="donut" data={dailyDonut}/>
          }
        </div>
      </div>
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>Today's Breakdown</h3></div>
        <BreakdownBars logs={logs}/>
      </div>
    </div>
  );

  // ── FOCUSED: Weekly ──────────────────────────────────────
  if (tab === 'weekly') return (
    <div className="tb-page">
      <HeaderBand title="Weekly View" subtitle="Last 7 days" totalH={totalH} onLogTime={()=>openForm()} shared={shared} onShare={handleShare}/>
      <ViewNav active="weekly"/>
      {showForm && <LogForm editEntry={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}
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
        <div className="tb-card-header"><CalendarDays size={16} style={{color:C.violet}}/><h3>Today's Log</h3><span className="tb-badge">{logs.length} entries</span></div>
        <TodayLog logs={logs} onEdit={openForm} onDelete={id=>setLogs(p=>p.filter(x=>x.id!==id))}/>
      </div>
    </div>
  );

  // ── FOCUSED: Monthly ─────────────────────────────────────
  if (tab === 'monthly') return (
    <div className="tb-page">
      <HeaderBand title="Monthly View" subtitle="Current month trend" totalH={totalH} onLogTime={()=>openForm()} shared={shared} onShare={handleShare}/>
      <ViewNav active="monthly"/>
      {showForm && <LogForm editEntry={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>Monthly Trend — Hours per Category</h3></div>
        <TimeBalancerChart type="line" data={MONTHLY_DATA} xKey="month"/>
      </div>
      <div className="tb-card">
        <div className="tb-card-header"><TrendingUp size={16} style={{color:C.violet}}/><h3>This Month's Breakdown</h3></div>
        <BreakdownBars logs={logs}/>
      </div>
    </div>
  );

  // ── OVERVIEW (no tab — clicking "Time Balancer" parent) ──
  return (
    <div className="tb-page">
      <HeaderBand title="Time Balancer" subtitle={todayLabel} totalH={totalH} onLogTime={()=>openForm()} shared={shared} onShare={handleShare}/>
      <ViewNav active="overview"/>
      {showForm && <LogForm editEntry={editEntry} onSubmit={handleSubmit} onCancel={closeForm}/>}

      {/* stat cards row */}
      <div className="tb-stat-cards">
        {CATEGORIES.map(c => {
          const hrs = logs.filter(e=>e.category===c.key).reduce((s,e)=>s+toH(e.hours,e.minutes),0);
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
            <span className="tb-badge">{logs.length} entries</span>
          </div>
          <TodayLog logs={logs} onEdit={openForm} onDelete={id=>setLogs(p=>p.filter(x=>x.id!==id))}/>
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
        <BreakdownBars logs={logs}/>
      </div>
    </div>
  );
}
