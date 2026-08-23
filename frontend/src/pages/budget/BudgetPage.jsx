import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, PiggyBank, BarChart3,
  FileText, Landmark, Wallet, Link2, Trash2, FileSpreadsheet,
  Image, FileBadge, IndianRupee
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import BudgetEntryForm from './BudgetEntryForm';
import BudgetEntryList from './BudgetEntryList';
import './BudgetPage.css';

// ── palette ──────────────────────────────────────────────
const C = {
  indigo:  '#343090',
  violet:  '#5f59f7',
  blue:    '#6592fd',
  sky:     '#44c2fd',
  purple:  '#8c61ff',
};

// ── field configs ─────────────────────────────────────────
const INCOME_FIELDS = [
  { key: 'source',  label: 'Source',  required: true },
  { key: 'amount',  label: 'Amount',  type: 'number', required: true },
  { key: 'date',    label: 'Date',    type: 'date' },
  { key: 'notes',   label: 'Notes',   type: 'textarea', required: false },
];
const EXPENSE_FIELDS = [
  { key: 'category', label: 'Category', required: true },
  { key: 'amount',   label: 'Amount',   type: 'number', required: true },
  { key: 'date',     label: 'Date',     type: 'date' },
  { key: 'notes',    label: 'Notes',    type: 'textarea', required: false },
];
const INVEST_FIELDS = [
  { key: 'name',         label: 'Type / Name',     required: true },
  { key: 'amount',       label: 'Amount Invested',  type: 'number', required: true },
  { key: 'currentValue', label: 'Current Value',    type: 'number', required: false },
  { key: 'date',         label: 'Date',             type: 'date' },
  { key: 'notes',        label: 'Notes',            type: 'textarea', required: false },
];
const SAVINGS_FIELDS = [
  { key: 'goal',   label: 'Goal / Label', required: true },
  { key: 'amount', label: 'Amount Saved', type: 'number', required: true },
  { key: 'date',   label: 'Date',         type: 'date' },
  { key: 'notes',  label: 'Notes',        type: 'textarea', required: false },
];

// ── mock data ─────────────────────────────────────────────
const MOCK_INCOME = [
  { id: 1, source: 'Salary',       amount: 45000, date: '2025-07-01', notes: 'Monthly salary' },
  { id: 2, source: 'Freelance',    amount: 12000, date: '2025-07-10', notes: 'Web project' },
  { id: 3, source: 'Dividends',    amount: 3200,  date: '2025-07-15', notes: '' },
];
const MOCK_EXPENSES = [
  { id: 1, category: 'Rent',       amount: 12000, date: '2025-07-01', notes: '' },
  { id: 2, category: 'Groceries',  amount: 4500,  date: '2025-07-05', notes: '' },
  { id: 3, category: 'Transport',  amount: 2200,  date: '2025-07-08', notes: 'Fuel + metro' },
  { id: 4, category: 'Utilities',  amount: 1800,  date: '2025-07-10', notes: 'Electricity & internet' },
  { id: 5, category: 'Dining',     amount: 3100,  date: '2025-07-18', notes: '' },
];
const MOCK_INVEST = [
  { id: 1, name: 'Mutual Fund',    amount: 10000, currentValue: 11200, date: '2025-07-01', notes: 'SIP' },
  { id: 2, name: 'Stocks – INFY',  amount: 8000,  currentValue: 8750,  date: '2025-07-05', notes: '' },
  { id: 3, name: 'PPF',            amount: 5000,  currentValue: 5000,  date: '2025-07-01', notes: 'Annual' },
];
const MOCK_SAVINGS = [
  { id: 1, goal: 'Emergency Fund', amount: 15000, date: '2025-07-01', notes: '3-month target' },
  { id: 2, goal: 'Laptop Upgrade', amount: 5000,  date: '2025-07-15', notes: '' },
];
const MOCK_DOCS = [
  { id: 1, name: 'July Bank Statement.pdf',   type: 'pdf',   link: '#' },
  { id: 2, name: 'Investment Proof Q1.xlsx',  type: 'excel', link: '#' },
  { id: 3, name: 'Salary Slip July.pdf',      type: 'pdf',   link: '#' },
];

const MONTHLY_DATA = [
  { month: 'Feb', income: 52000, expenses: 22000, savings: 12000, investments: 8000 },
  { month: 'Mar', income: 55000, expenses: 24000, savings: 14000, investments: 10000 },
  { month: 'Apr', income: 50000, expenses: 21000, savings: 11000, investments: 9000 },
  { month: 'May', income: 58000, expenses: 26000, savings: 15000, investments: 12000 },
  { month: 'Jun', income: 54000, expenses: 23000, savings: 13000, investments: 11000 },
  { month: 'Jul', income: 60200, expenses: 23600, savings: 20000, investments: 23000 },
];

const YEARLY_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  income:      40000 + Math.round(Math.random() * 20000),
  expenses:    18000 + Math.round(Math.random() * 10000),
  savings:     8000  + Math.round(Math.random() * 8000),
  investments: 5000  + Math.round(Math.random() * 10000),
}));

const BALANCE_TREND = MONTHLY_DATA.map(d => ({
  month: d.month,
  balance: d.income - d.expenses,
}));

// ── helpers ───────────────────────────────────────────────
const sum = (arr, key) => arr.reduce((a, b) => a + (parseFloat(b[key]) || 0), 0);
const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const DOC_ICONS = {
  pdf:   <FileBadge size={16} color={C.violet} />,
  excel: <FileSpreadsheet size={16} color={C.sky} />,
  image: <Image size={16} color={C.purple} />,
};

const TABS = [
  { key: 'income',      label: 'Income',      icon: <TrendingUp size={15} /> },
  { key: 'expenses',    label: 'Expenses',    icon: <TrendingDown size={15} /> },
  { key: 'investments', label: 'Investments', icon: <Landmark size={15} /> },
  { key: 'savings',     label: 'Savings',     icon: <PiggyBank size={15} /> },
  { key: 'documents',   label: 'Documents',   icon: <FileText size={15} /> },
  { key: 'reports',     label: 'Reports',     icon: <BarChart3 size={15} /> },
];

// ── sub-sections ──────────────────────────────────────────
function Section({ title, icon, stat, children }) {
  return (
    <div className="bgt-section">
      <div className="bgt-section-header">
        <span className="bgt-section-icon">{icon}</span>
        <h3>{title}</h3>
        {stat && <span className="bgt-section-stat">{stat}</span>}
      </div>
      {children}
    </div>
  );
}

// ── main page ─────────────────────────────────────────────
const PATH_TAB = {
  'income': 'income', 'expenses': 'expenses', 'investments': 'investments',
  'savings': 'savings', 'documents': 'documents', 'reports': 'reports',
};

export default function BudgetPage({ initialTab = 'income' }) {
  const location = useLocation();
  const segmentTab = PATH_TAB[location.pathname.split('/').pop()] || initialTab;
  const [tab, setTab] = useState(segmentTab);

  useEffect(() => {
    const t = PATH_TAB[location.pathname.split('/').pop()];
    if (t) setTab(t);
  }, [location.pathname]);
  const [income,      setIncome]      = useState(MOCK_INCOME);
  const [expenses,    setExpenses]    = useState(MOCK_EXPENSES);
  const [investments, setInvestments] = useState(MOCK_INVEST);
  const [savings,     setSavings]     = useState(MOCK_SAVINGS);
  const [docs,        setDocs]        = useState(MOCK_DOCS);

  const totalIncome  = sum(income, 'amount');
  const totalExpense = sum(expenses, 'amount');
  const totalInvest  = sum(investments, 'amount');
  const totalSavings = sum(savings, 'amount');
  const balance      = totalIncome - totalExpense;

  const addEntry    = (setter) => (e) => setter(p => [e, ...p]);
  const deleteEntry = (setter) => (id) => setter(p => p.filter(x => x.id !== id));
  const editEntry   = (setter) => (e) => setter(p => p.map(x => x.id === e.id ? e : x));

  // expense category breakdown
  const catMap = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  return (
    <div className="bgt-page">
      {/* ── header band ── */}
      <div className="bgt-header-band">
        <div className="bgt-header-left">
          <Wallet size={22} />
          <h2>Budget</h2>
        </div>
        <div className="bgt-summary-strip">
          <div className="bgt-balance-block">
            <span className="bgt-balance-label">Available Balance</span>
            <span className="bgt-balance-value">{fmt(balance)}</span>
          </div>
          <div className="bgt-strip-divider" />
          <div className="bgt-strip-stat">
            <TrendingUp size={14} />
            <span className="bgt-strip-label">Income</span>
            <span className="bgt-strip-num income">{fmt(totalIncome)}</span>
          </div>
          <div className="bgt-strip-stat">
            <TrendingDown size={14} />
            <span className="bgt-strip-label">Expenses</span>
            <span className="bgt-strip-num expense">{fmt(totalExpense)}</span>
          </div>
          <div className="bgt-strip-stat">
            <Landmark size={14} />
            <span className="bgt-strip-label">Invested</span>
            <span className="bgt-strip-num invest">{fmt(totalInvest)}</span>
          </div>
          <div className="bgt-strip-stat">
            <PiggyBank size={14} />
            <span className="bgt-strip-label">Savings</span>
            <span className="bgt-strip-num savings">{fmt(totalSavings)}</span>
          </div>
        </div>
      </div>

      {/* ── tabs ── */}
      <div className="bgt-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`bgt-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── tab content ── */}
      <div className="bgt-content">

        {tab === 'income' && (
          <Section title="Income" icon={<TrendingUp size={16} />} stat={`Total: ${fmt(totalIncome)}`}>
            <BudgetEntryForm fields={INCOME_FIELDS} onAdd={addEntry(setIncome)} accentColor={C.sky} />
            <BudgetEntryList entries={income} fields={INCOME_FIELDS} onDelete={deleteEntry(setIncome)} onEdit={editEntry(setIncome)} />
          </Section>
        )}

        {tab === 'expenses' && (
          <>
            <Section title="Expenses" icon={<TrendingDown size={16} />} stat={`Total: ${fmt(totalExpense)}`}>
              <BudgetEntryForm fields={EXPENSE_FIELDS} onAdd={addEntry(setExpenses)} accentColor={C.violet} />
              <BudgetEntryList entries={expenses} fields={EXPENSE_FIELDS} onDelete={deleteEntry(setExpenses)} onEdit={editEntry(setExpenses)} />
            </Section>
            <div className="bgt-calculator">
              <h4><IndianRupee size={14} /> Expense Calculator</h4>
              <div className="bgt-calc-row">
                <span>Total Income</span><span className="income">{fmt(totalIncome)}</span>
              </div>
              <div className="bgt-calc-row">
                <span>Total Spent</span><span className="expense">{fmt(totalExpense)}</span>
              </div>
              <div className="bgt-calc-row total">
                <span>Left in Hand</span><span className={balance >= 0 ? 'income' : 'expense'}>{fmt(balance)}</span>
              </div>
              <div className="bgt-calc-bar">
                <div className="bgt-calc-fill" style={{ width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%` }} />
              </div>
              <span className="bgt-calc-pct">{totalIncome ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}% of income spent</span>
            </div>
          </>
        )}

        {tab === 'investments' && (
          <Section title="Investments" icon={<Landmark size={16} />} stat={`Total Invested: ${fmt(totalInvest)}`}>
            <BudgetEntryForm fields={INVEST_FIELDS} onAdd={addEntry(setInvestments)} accentColor={C.blue} />
            <BudgetEntryList entries={investments} fields={INVEST_FIELDS} onDelete={deleteEntry(setInvestments)} onEdit={editEntry(setInvestments)} />
          </Section>
        )}

        {tab === 'savings' && (
          <Section title="Savings" icon={<PiggyBank size={16} />} stat={`Total Saved: ${fmt(totalSavings)}`}>
            <BudgetEntryForm fields={SAVINGS_FIELDS} onAdd={addEntry(setSavings)} accentColor={C.purple} />
            <BudgetEntryList entries={savings} fields={SAVINGS_FIELDS} onDelete={deleteEntry(setSavings)} onEdit={editEntry(setSavings)} />
          </Section>
        )}

        {tab === 'documents' && (
          <Section title="Budget Documents" icon={<FileText size={16} />}>
            <div className="bgt-doc-upload">
              <Link2 size={14} />
              <input placeholder="File name" id="doc-name" />
              <input placeholder="Link / URL" id="doc-link" />
              <select id="doc-type">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="image">Image</option>
              </select>
              <button className="bgt-btn-primary" style={{ background: C.violet }} onClick={() => {
                const name = document.getElementById('doc-name').value;
                const link = document.getElementById('doc-link').value;
                const type = document.getElementById('doc-type').value;
                if (!name) return;
                setDocs(p => [{ id: Date.now(), name, link: link || '#', type }, ...p]);
                document.getElementById('doc-name').value = '';
                document.getElementById('doc-link').value = '';
              }}>Add</button>
            </div>
            {docs.length === 0 ? (
              <div className="bgt-empty"><span>No documents yet — add your first one</span></div>
            ) : (
              <div className="bgt-doc-list">
                {docs.map(d => (
                  <div key={d.id} className="bgt-doc-row">
                    <span className="bgt-doc-icon">{DOC_ICONS[d.type] || <FileText size={16} />}</span>
                    <span className="bgt-doc-name">{d.name}</span>
                    <a href={d.link} className="bgt-doc-link" target="_blank" rel="noreferrer"><Link2 size={13} /> Open</a>
                    <button className="bgt-icon-btn red" onClick={() => setDocs(p => p.filter(x => x.id !== d.id))}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {tab === 'reports' && (
          <div className="bgt-reports">
            <div className="bgt-report-grid">
              {/* Monthly bar chart */}
              <div className="bgt-chart-card">
                <h4>Monthly Summary</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={MONTHLY_DATA} barSize={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#aaa' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#aaa' }} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income"      fill={C.sky}    name="Income" radius={[4,4,0,0]} />
                    <Bar dataKey="expenses"    fill={C.violet} name="Expenses" radius={[4,4,0,0]} />
                    <Bar dataKey="savings"     fill={C.purple} name="Savings" radius={[4,4,0,0]} />
                    <Bar dataKey="investments" fill={C.blue}   name="Investments" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Yearly area chart */}
              <div className="bgt-chart-card">
                <h4>Yearly Overview</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={YEARLY_DATA}>
                    <defs>
                      {[['inc', C.sky], ['exp', C.violet], ['sav', C.purple], ['inv', C.blue]].map(([id, color]) => (
                        <linearGradient key={id} id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#aaa' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#aaa' }} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="income"      stroke={C.sky}    fill={`url(#g-inc)`} name="Income" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses"    stroke={C.violet} fill={`url(#g-exp)`} name="Expenses" strokeWidth={2} />
                    <Area type="monotone" dataKey="savings"     stroke={C.purple} fill={`url(#g-sav)`} name="Savings" strokeWidth={2} />
                    <Area type="monotone" dataKey="investments" stroke={C.blue}   fill={`url(#g-inv)`} name="Investments" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Balance trend */}
              <div className="bgt-chart-card">
                <h4>Available Balance Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={BALANCE_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#aaa' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#aaa' }} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="balance" stroke={C.sky} strokeWidth={2.5} dot={{ fill: C.sky, r: 4 }} name="Balance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category breakdown */}
              <div className="bgt-chart-card">
                <h4>This Month — Expense Breakdown</h4>
                <div className="bgt-breakdown">
                  {Object.entries(catMap).map(([cat, amt], i) => {
                    const pct = totalExpense ? ((amt / totalExpense) * 100).toFixed(1) : 0;
                    const colors = [C.violet, C.blue, C.sky, C.purple, C.indigo];
                    return (
                      <div key={cat} className="bgt-breakdown-row">
                        <span className="bgt-bd-dot" style={{ background: colors[i % colors.length] }} />
                        <span className="bgt-bd-cat">{cat}</span>
                        <div className="bgt-bd-bar-wrap">
                          <div className="bgt-bd-bar" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                        </div>
                        <span className="bgt-bd-pct">{pct}%</span>
                        <span className="bgt-bd-amt">{fmt(amt)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
