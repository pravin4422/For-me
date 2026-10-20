import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare, BookOpen, Clock,
  Wallet, Heart, Briefcase, Bell, Sparkles, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DashboardCard from '../../components/cards/DashboardCard';
import { getTodos } from '../../api/todo/index.js';
import * as plannerApi from '../../api/study/plannerApi';
import { getIncomes } from '../../api/budget/incomeApi';
import { getExpenses } from '../../api/budget/expenseApi';
import './Overview.css';

const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });



const TIME_DATA = [
  { name: 'Study', value: 4, color: '#6366f1' },
  { name: 'Work', value: 3, color: '#0ea5e9' },
  { name: 'Sleep', value: 7, color: '#8b5cf6' },
  { name: 'Exercise', value: 1, color: '#10b981' },
  { name: 'Other', value: 2, color: '#f59e0b' },
];

const HEALTH = [
  { label: 'Water', value: 6, max: 8, unit: 'glasses', color: '#0ea5e9' },
  { label: 'Sleep', value: 7, max: 8, unit: 'hrs', color: '#8b5cf6' },
  { label: 'Steps', value: 6200, max: 10000, unit: 'steps', color: '#10b981' },
  { label: 'Calories', value: 1800, max: 2200, unit: 'kcal', color: '#f59e0b' },
];

const WATCHLIST = [
  { name: 'TCS', action: 'Apply by Jul 10', type: 'IT' },
  { name: 'Infosys', action: 'Interview Jul 15', type: 'IT' },
  { name: 'DRDO', action: 'Notification out', type: 'Govt' },
];

const NOTIFS = [
  { text: 'RRB mock test reminder — tomorrow 10 AM', time: '2h ago', type: 'exam' },
  { text: 'Budget: June expenses updated', time: '5h ago', type: 'budget' },
  { text: 'New SSC CGL notification released', time: '1d ago', type: 'career' },
];

const QUOTES = [
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
];

function RingProgress({ value, max, color, label, unit }) {
  const pct = Math.min(value / max, 1);
  const r = 28, cx = 34, cy = 34;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <div className="ring-wrap">
      <svg width="68" height="68">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <div className="ring-label">
        <span className="ring-val">{value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}</span>
        <span className="ring-unit">{unit}</span>
      </div>
      <span className="ring-name">{label}</span>
    </div>
  );
}

const STUDY_TYPES = [
  { type: 'planner',   label: 'Study Planner',    color: '#6366f1' },
  { type: 'revision',  label: 'Revision Tracker', color: '#8b5cf6' },
  { type: 'practice',  label: 'Practice',         color: '#0ea5e9' },
  { type: 'mock-test', label: 'Mock Tests',        color: '#10b981' },
];

export default function Overview() {
  const navigate = useNavigate();
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    getTodos()
      .then(r => setTasks(r.data.data.map(t => ({ ...t, id: t._id }))))
      .catch(() => {});
  }, []);

  const [budgetData, setBudgetData] = useState([]);
  const [budgetBalance, setBudgetBalance] = useState(null);
  useEffect(() => {
    Promise.all([getIncomes(), getExpenses()]).then(([incRes, expRes]) => {
      const incomes  = incRes.data.data  || [];
      const expenses = expRes.data.data  || [];
      const monthMap = {};
      incomes.forEach(({ date, amount }) => {
        const d = new Date(date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthMap[key]) monthMap[key] = { year: d.getFullYear(), month: d.getMonth(), income: 0, spend: 0 };
        monthMap[key].income += Number(amount) || 0;
      });
      expenses.forEach(({ date, amount }) => {
        const d = new Date(date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthMap[key]) monthMap[key] = { year: d.getFullYear(), month: d.getMonth(), income: 0, spend: 0 };
        monthMap[key].spend += Number(amount) || 0;
      });
      const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const sorted = Object.values(monthMap)
        .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
        .slice(-6)
        .map(m => ({ name: MONTH_NAMES[m.month], income: m.income, spend: m.spend }));
      setBudgetData(sorted);
      const totalIncome  = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
      const totalExpense = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
      setBudgetBalance(totalIncome - totalExpense);
    }).catch(() => {});
  }, []);

  const [studyProgress, setStudyProgress] = useState([]);
  useEffect(() => {
    Promise.all(
      STUDY_TYPES.map(t =>
        plannerApi.getPlans(null, t.type).then(async r => {
          const folders = r.data.data;
          if (folders.length === 0) return { ...t, done: 0, total: 0 };
          const results = await Promise.all(folders.map(f => plannerApi.getItems(f._id).then(ir => ir.data.data)));
          const all = results.flat();
          return { ...t, done: all.filter(i => i.completed).length, total: all.length };
        })
      )
    ).then(setStudyProgress).catch(() => {});
  }, []);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay   = new Date(startOfDay.getTime() + 86400000 - 1);
  const todayTasks = tasks.filter(t => {
    if (t.repeat && t.repeat !== 'none') return true;
    if (!t.dueDate) return true;
    const d = new Date(t.dueDate);
    return d >= startOfDay && d <= endOfDay;
  });
  const pendingToday   = todayTasks.filter(t => !t.completed);
  const completedToday = todayTasks.filter(t => t.completed);
  const overdueTasks   = tasks.filter(t => t.overdue && !t.completed);
  const displayTasks   = [...pendingToday, ...completedToday];

  const totalDone  = studyProgress.reduce((s, t) => s + t.done, 0);
  const totalItems = studyProgress.reduce((s, t) => s + t.total, 0);
  const overallPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  return (
    <div className="overview-grid">

      {/* 1. Today's Overview */}
      <DashboardCard title="Today's Overview" icon={<TrendingUp size={16} />} className="card-wide">
        <div className="today-strip">
          <div className="today-date">{today}</div>
          <div className="today-stats">
            <div className="stat-chip"><span className="stat-num">{pendingToday.length}</span><span>Tasks Due</span></div>
            <div className="stat-chip"><span className="stat-num">{completedToday.length}</span><span>Completed</span></div>
            <div className="stat-chip"><span className="stat-num">{overdueTasks.length}</span><span>Overdue</span></div>
            <div className="stat-chip"><span className="stat-num">78%</span><span>Study Goal</span></div>
            <div className="stat-chip"><span className="stat-num">18d</span><span>Next Exam</span></div>
          </div>
        </div>
      </DashboardCard>

      {/* 2. To-Do */}
      <DashboardCard title="To-Do" icon={<CheckSquare size={16} />} viewAllLink="/dashboard/todo/daily">
        {displayTasks.length === 0 ? (
          <div className="todo-empty">No tasks for today</div>
        ) : (
          <ul className="todo-list">
            {displayTasks.map(t => (
              <li key={t.id} className={`todo-item ${t.completed ? 'done' : ''}`}>
                <span className={`priority-dot p-${(t.priority || 'medium').toLowerCase()}`} />
                <span className="todo-text">{t.title}</span>
                <span className={`priority-tag p-${(t.priority || 'medium').toLowerCase()}`}>{t.priority}</span>
              </li>
            ))}
          </ul>
        )}
        <button className="quick-add-btn" onClick={() => navigate('/dashboard/todo/daily')}>+ Add Task</button>
      </DashboardCard>

      {/* 3. Study Progress */}
      <DashboardCard title="Study Progress" icon={<BookOpen size={16} />} viewAllLink="/dashboard/study/planner">
        {studyProgress.length === 0 ? (
          <div className="tab-loading" style={{ padding: '12px 0' }}>Loading…</div>
        ) : (
          <div className="study-progress-list">
            <div className="study-overall-row">
              <span className="study-overall-label">Overall</span>
              <span className="study-overall-pct" style={{ color: 'var(--accent)' }}>{overallPct}%</span>
            </div>
            <div className="progress-bar-wrap" style={{ marginBottom: 12 }}>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${overallPct}%` }} /></div>
            </div>
            {studyProgress.map(s => {
              const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <div key={s.type} className="study-type-row">
                  <div className="study-type-top">
                    <span className="study-type-label">{s.label}</span>
                    <span className="study-type-counts">{s.done}/{s.total}</span>
                    <span className="study-type-pct" style={{ color: s.color }}>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardCard>

      {/* 6. Time Summary */}
      <DashboardCard title="Time Summary" icon={<Clock size={16} />} viewAllLink="/dashboard/time/daily">
        <div className="time-chart-wrap">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={TIME_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2}>
                {TIME_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="time-legend">
            {TIME_DATA.map(d => (
              <div key={d.name} className="time-legend-item">
                <span className="legend-dot" style={{ background: d.color }} />
                <span>{d.name}</span>
                <span className="legend-val">{d.value}h</span>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

      {/* 7. Budget Summary */}
      <DashboardCard title="Budget Summary" icon={<Wallet size={16} />} viewAllLink="/dashboard/budget/reports">
        <div className="budget-balance">Available: <strong>{budgetBalance !== null ? `₹${budgetBalance.toLocaleString('en-IN')}` : '—'}</strong></div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={budgetData} barSize={8}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" fill="#10b981" radius={4} />
            <Bar dataKey="spend" fill="var(--accent)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardCard>

      {/* 8. Health Summary */}
      <DashboardCard title="Health Summary" icon={<Heart size={16} />} viewAllLink="/dashboard/health/checklist">
        <div className="health-rings">
          {HEALTH.map(h => <RingProgress key={h.label} {...h} />)}
        </div>
      </DashboardCard>

      {/* 9. Career Watchlist */}
      <DashboardCard title="Career Watchlist" icon={<Briefcase size={16} />} viewAllLink="/dashboard/career/watchlist">
        <ul className="watchlist">
          {WATCHLIST.map(c => (
            <li key={c.name} className="watchlist-item">
              <div className="watchlist-name">{c.name} <span className="watchlist-type">{c.type}</span></div>
              <div className="watchlist-action">{c.action}</div>
            </li>
          ))}
        </ul>
      </DashboardCard>

      {/* 10. Notifications */}
      <DashboardCard title="Notifications" icon={<Bell size={16} />} viewAllLink="/dashboard/notifications">
        <ul className="notif-list">
          {NOTIFS.map((n, i) => (
            <li key={i} className="notif-item">
              <span className={`notif-dot type-${n.type}`} />
              <div>
                <div className="notif-text">{n.text}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </DashboardCard>

      {/* 11. Vision Board / Motivation */}
      <DashboardCard title="Motivation" icon={<Sparkles size={16} />} viewAllLink="/dashboard/motivation/vision-board" className="card-wide">
        <div className="motivation-wrap">
          <div className="quote-block">
            <span className="quote-mark">"</span>
            <p className="quote-text">{quote}</p>
          </div>
          <div className="vision-placeholders">
            {[1,2,3].map(i => (
              <div key={i} className="vision-thumb">
                <Sparkles size={20} />
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

    </div>
  );
}
