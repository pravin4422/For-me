import {
  CheckSquare, BookOpen, FileText, Target, Clock,
  Wallet, Heart, Briefcase, Bell, Sparkles, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import DashboardCard from '../../components/cards/DashboardCard';
import './Overview.css';

const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const TASKS = [
  { id: 1, text: 'Complete RRB mock test', priority: 'high', done: false },
  { id: 2, text: 'Revise Quantitative Aptitude', priority: 'medium', done: false },
  { id: 3, text: 'Update budget for June', priority: 'low', done: true },
  { id: 4, text: 'Read 20 pages of current affairs', priority: 'high', done: false },
  { id: 5, text: 'Log today\'s water intake', priority: 'low', done: false },
];

const EXAMS = [
  { name: 'RRB NTPC', days: 18, color: '#6366f1' },
  { name: 'SSC CGL', days: 34, color: '#0ea5e9' },
  { name: 'TNPSC Gr 2', days: 62, color: '#10b981' },
];

const BUDGET_DATA = [
  { name: 'Jan', income: 32000, spend: 21000 },
  { name: 'Feb', income: 32000, spend: 18500 },
  { name: 'Mar', income: 35000, spend: 24000 },
  { name: 'Apr', income: 32000, spend: 19000 },
  { name: 'May', income: 38000, spend: 22000 },
  { name: 'Jun', income: 32000, spend: 15000 },
];

const TIME_DATA = [
  { name: 'Study', value: 4, color: '#6366f1' },
  { name: 'Work', value: 3, color: '#0ea5e9' },
  { name: 'Sleep', value: 7, color: '#8b5cf6' },
  { name: 'Exercise', value: 1, color: '#10b981' },
  { name: 'Other', value: 2, color: '#f59e0b' },
];

const MOCK_TREND = [
  { t: 1, score: 62 }, { t: 2, score: 70 }, { t: 3, score: 67 },
  { t: 4, score: 75 }, { t: 5, score: 80 }, { t: 6, score: 78 },
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

export default function Overview() {
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <div className="overview-grid">

      {/* 1. Today's Overview */}
      <DashboardCard title="Today's Overview" icon={<TrendingUp size={16} />} className="card-wide">
        <div className="today-strip">
          <div className="today-date">{today}</div>
          <div className="today-stats">
            <div className="stat-chip"><span className="stat-num">3</span><span>Tasks Due</span></div>
            <div className="stat-chip"><span className="stat-num">78%</span><span>Study Goal</span></div>
            <div className="stat-chip"><span className="stat-num">18d</span><span>Next Exam</span></div>
            <div className="stat-chip"><span className="stat-num">₹17k</span><span>Balance</span></div>
          </div>
        </div>
      </DashboardCard>

      {/* 2. To-Do */}
      <DashboardCard title="To-Do" icon={<CheckSquare size={16} />} viewAllLink="/dashboard/todo/daily">
        <ul className="todo-list">
          {TASKS.map(t => (
            <li key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
              <span className={`priority-dot p-${t.priority}`} />
              <span className="todo-text">{t.text}</span>
              <span className={`priority-tag p-${t.priority}`}>{t.priority}</span>
            </li>
          ))}
        </ul>
        <button className="quick-add-btn">+ Add Task</button>
      </DashboardCard>

      {/* 3. Study Progress */}
      <DashboardCard title="Study Progress" icon={<BookOpen size={16} />} viewAllLink="/dashboard/study/planner">
        <div className="study-subject">Quantitative Aptitude</div>
        <div className="study-topic">Current: Number System</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar"><div className="progress-fill" style={{ width: '68%' }} /></div>
          <span className="progress-pct">68%</span>
        </div>
        <div className="streak-row">
          <span className="streak-badge">🔥 12-day streak</span>
          <span className="study-muted">Next: Algebra</span>
        </div>
      </DashboardCard>

      {/* 4. Upcoming Exams */}
      <DashboardCard title="Upcoming Exams" icon={<FileText size={16} />} viewAllLink="/dashboard/exams">
        <div className="exam-chips">
          {EXAMS.map(e => (
            <div key={e.name} className="exam-chip" style={{ borderColor: e.color }}>
              <span className="exam-name">{e.name}</span>
              <span className="exam-days" style={{ color: e.color }}>{e.days}d</span>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* 5. Mock Test Results */}
      <DashboardCard title="Mock Test Results" icon={<Target size={16} />} viewAllLink="/dashboard/mocktest/results">
        <div className="mock-stats">
          <div className="mock-score">78<span>/100</span></div>
          <div className="mock-meta">
            <span className="mock-acc">Accuracy: 82%</span>
            <span className="mock-time">Time: 48 min</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={MOCK_TREND}>
            <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
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
        <div className="budget-balance">Available: <strong>₹17,000</strong></div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={BUDGET_DATA} barSize={8}>
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
