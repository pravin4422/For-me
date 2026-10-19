import { useState, useEffect, useCallback } from 'react';
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
import { getIncomes, createIncome, updateIncome, deleteIncome } from '../../api/budget/incomeApi';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../../api/budget/expenseApi';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../../api/budget/investmentApi';
import { getSavings, createSaving, updateSaving, deleteSaving } from '../../api/budget/savingApi';
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
  { key: 'source',    label: 'Income Name / Source', required: true },
  { key: 'amount',    label: 'Amount',               type: 'number',   required: true },
  { key: 'category',  label: 'Category',             type: 'select',   required: true,
    options: ['Salary', 'Freelance', 'Business', 'Rental', 'Dividends', 'Bonus', 'Gift', 'Other'] },
  { key: 'salaryType',label: 'Salary Type',          type: 'select',   required: false,
    options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Self-employed', 'N/A'] },
  { key: 'date',      label: 'Date',                 type: 'date' },
  { key: 'notes',     label: 'Notes / Description',  type: 'textarea', required: false },
  { key: 'statement', label: 'Statement',            type: 'file',     required: false },
];
const EXPENSE_FIELDS = [
  { key: 'name',     label: 'Expense Name',  required: true },
  { key: 'category', label: 'Category',      type: 'select', required: true,
    options: ['Food & Dining', 'Rent', 'Groceries', 'Transport', 'Utilities', 'Healthcare',
              'Shopping', 'Entertainment', 'Education', 'Travel', 'Fuel', 'Insurance', 'EMI', 'Other'] },
  { key: 'amount',   label: 'Amount',        type: 'number',   required: true },
  { key: 'date',     label: 'Date',          type: 'date',     required: true },
  { key: 'notes',    label: 'Notes',         type: 'textarea', required: false },
  { key: 'document', label: 'Document',      type: 'file',     required: false },
];
const INVEST_FIELDS = [
  { key: 'name',         label: 'Type / Name',     required: true },
  { key: 'category',     label: 'Category',         type: 'select', required: true,
    options: ['Mutual Fund', 'Stocks', 'PPF', 'EPF', 'NPS', 'Fixed Deposit', 'Gold', 'Real Estate', 'Crypto', 'Bonds', 'SIP', 'Other'] },
  { key: 'amount',       label: 'Amount Invested',  type: 'number', required: true },
  { key: 'currentValue', label: 'Current Value',    type: 'number', required: false },
  { key: 'date',         label: 'Date',             type: 'date' },
  { key: 'notes',        label: 'Notes',            type: 'textarea', required: false },
  { key: 'document',     label: 'Document',         type: 'file',     required: false },
];
const SAVINGS_FIELDS = [
  { key: 'goal',     label: 'Goal / Label', required: true },
  { key: 'category', label: 'Category',     type: 'select', required: true,
    options: ['Emergency Fund', 'Vacation', 'Education', 'Home', 'Vehicle', 'Wedding', 'Retirement', 'Gadget', 'Health', 'Other'] },
  { key: 'amount',   label: 'Amount Saved', type: 'number',   required: true },
  { key: 'date',     label: 'Date',         type: 'date' },
  { key: 'notes',    label: 'Notes',        type: 'textarea', required: false },
  { key: 'document', label: 'Document',     type: 'file',     required: false },
];

// ── mock data ─────────────────────────────────────────────
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

// parse "YYYY-MM-DD" safely without timezone shift
const parseDate = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d }; // month is 0-indexed
};

const inMonth = (e, year, month) => {
  const p = parseDate(e.date);
  return p && p.year === year && p.month === month;
};

const monthDiff = (e, now) => {
  const p = parseDate(e.date);
  if (!p) return -1;
  return (now.getFullYear() - p.year) * 12 + (now.getMonth() - p.month);
};

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

// ── income stats ─────────────────────────────────────────
function IncomeStats({ income }) {
  const now = new Date();
  const thisMonth = income.filter(e => inMonth(e, now.getFullYear(), now.getMonth()));
  const last6     = income.filter(e => { const d = monthDiff(e, now); return d >= 0 && d < 6; });
  const lastYear  = income.filter(e => { const d = monthDiff(e, now); return d >= 0 && d < 12; });
  const stats = [
    { label: 'This Month',   value: sum(thisMonth, 'amount'), color: C.sky },
    { label: 'Last 6 Months', value: sum(last6,    'amount'), color: C.blue },
    { label: 'Last 1 Year',  value: sum(lastYear,  'amount'), color: C.purple },
  ];
  return (
    <div className="bgt-income-stats">
      {stats.map(s => (
        <div key={s.label} className="bgt-income-stat-card" style={{ borderTopColor: s.color }}>
          <span className="bgt-income-stat-label">{s.label}</span>
          <span className="bgt-income-stat-value" style={{ color: s.color }}>{fmt(s.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── expense stats ────────────────────────────────────────
function ExpenseStats({ expenses }) {
  const now = new Date();
  const filter = (months) => expenses.filter(e => { const d = monthDiff(e, now); return d >= 0 && d < months; });
  const stats = [
    { label: 'This Month',  value: sum(filter(1),  'amount'), color: '#ff8fa3' },
    { label: 'Last 3 Months', value: sum(filter(3), 'amount'), color: C.violet },
    { label: 'Last 6 Months', value: sum(filter(6), 'amount'), color: C.blue },
    { label: 'Last 1 Year',  value: sum(filter(12), 'amount'), color: C.purple },
  ];
  return (
    <div className="bgt-expense-stats">
      {stats.map(s => (
        <div key={s.label} className="bgt-income-stat-card" style={{ borderTopColor: s.color }}>
          <span className="bgt-income-stat-label">{s.label}</span>
          <span className="bgt-income-stat-value" style={{ color: s.color }}>{fmt(s.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── savings stats ───────────────────────────────────────
function SavingsStats({ savings }) {
  const now = new Date();
  const filter = (months) => savings.filter(e => { const d = monthDiff(e, now); return d >= 0 && d < months; });
  const stats = [
    { label: 'Total Saved',    value: fmt(sum(savings,    'amount')), color: C.purple },
    { label: 'This Month',     value: fmt(sum(filter(1),  'amount')), color: C.sky },
    { label: 'Last 6 Months',  value: fmt(sum(filter(6),  'amount')), color: C.blue },
    { label: 'Last 1 Year',    value: fmt(sum(filter(12), 'amount')), color: C.violet },
  ];
  return (
    <div className="bgt-income-stats">
      {stats.map(s => (
        <div key={s.label} className="bgt-income-stat-card" style={{ borderTopColor: s.color }}>
          <span className="bgt-income-stat-label">{s.label}</span>
          <span className="bgt-income-stat-value" style={{ color: s.color }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── investment stats ────────────────────────────────────
function InvestmentStats({ investments }) {
  const now = new Date();
  const filter = (months) => investments.filter(e => { const d = monthDiff(e, now); return d >= 0 && d < months; });
  const totalInvested = sum(investments, 'amount');
  const totalCurrent  = investments.reduce((a, b) => a + (parseFloat(b.currentValue) || parseFloat(b.amount) || 0), 0);
  const gain = totalCurrent - totalInvested;
  const stats = [
    { label: 'Total Invested',  value: fmt(totalInvested), color: C.blue },
    { label: 'Current Value',   value: fmt(totalCurrent),  color: C.sky },
    { label: 'Overall Gain/Loss', value: (gain >= 0 ? '+' : '') + fmt(gain), color: gain >= 0 ? '#4ade80' : '#ff8fa3' },
    { label: 'Last 6 Months',   value: fmt(sum(filter(6), 'amount')), color: C.purple },
  ];
  return (
    <div className="bgt-income-stats">
      {stats.map(s => (
        <div key={s.label} className="bgt-income-stat-card" style={{ borderTopColor: s.color }}>
          <span className="bgt-income-stat-label">{s.label}</span>
          <span className="bgt-income-stat-value" style={{ color: s.color }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── monthly calculator ───────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MonthlyCalculator({ expenses, income }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    if (isCurrentMonth) return;
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };

  const filterMonth = (arr) => arr.filter(e => inMonth(e, year, month));

  const monthIncome  = sum(filterMonth(income),   'amount');
  const monthSpent   = sum(filterMonth(expenses),  'amount');
  const monthBalance = monthIncome - monthSpent;
  const pct = monthIncome ? Math.min((monthSpent / monthIncome) * 100, 100) : 0;
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  // category breakdown for selected month
  const catMap = filterMonth(expenses).reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
    return acc;
  }, {});
  const colors = [C.violet, C.blue, C.sky, C.purple, '#ff8fa3', C.indigo];

  return (
    <>
      <div className="bgt-calculator">
        <div className="bgt-calc-header">
          <h4><IndianRupee size={14} /> Monthly Expense Calculator</h4>
          <div className="bgt-month-nav">
            <button className="bgt-icon-btn" onClick={prev}>&#8249;</button>
            <span className="bgt-month-label">{MONTH_NAMES[month]} {year}</span>
            <button className="bgt-icon-btn" onClick={next} disabled={isCurrentMonth} style={{ opacity: isCurrentMonth ? 0.3 : 1 }}>&#8250;</button>
          </div>
        </div>
        <div className="bgt-calc-row">
          <span>Income This Month</span><span className="income">{fmt(monthIncome)}</span>
        </div>
        <div className="bgt-calc-row">
          <span>Spent This Month</span><span className="expense">{fmt(monthSpent)}</span>
        </div>
        <div className="bgt-calc-row total">
          <span>Left in Hand</span>
          <span className={monthBalance >= 0 ? 'income' : 'expense'}>{fmt(monthBalance)}</span>
        </div>
        <div className="bgt-calc-bar">
          <div className="bgt-calc-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="bgt-calc-pct">{pct.toFixed(1)}% of income spent</span>
      </div>
      {Object.keys(catMap).length > 0 && (
        <div className="bgt-cat-cards">
          {Object.entries(catMap).map(([cat, amt], i) => {
            const p = monthSpent ? ((amt / monthSpent) * 100).toFixed(1) : 0;
            return (
              <div key={cat} className="bgt-cat-card" style={{ borderTopColor: colors[i % colors.length] }}>
                <div className="bgt-cat-card-top">
                  <span className="bgt-cat-card-dot" style={{ background: colors[i % colors.length] }} />
                  <span className="bgt-cat-card-name">{cat}</span>
                  <span className="bgt-cat-card-pct" style={{ color: colors[i % colors.length] }}>{p}%</span>
                </div>
                <span className="bgt-cat-card-amt">{fmt(amt)}</span>
                <div className="bgt-cat-card-bar">
                  <div className="bgt-cat-card-fill" style={{ width: `${p}%`, background: colors[i % colors.length] }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

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
  const [income,      setIncome]      = useState([]);
  const [incomeLoading,   setIncomeLoading]   = useState(false);
  const [expenses,        setExpenses]        = useState([]);
  const [expenseLoading,  setExpenseLoading]  = useState(false);
  const [investments,      setInvestments]      = useState([]);
  const [investmentLoading, setInvestmentLoading] = useState(false);
  const [savings,       setSavings]       = useState([]);
  const [savingLoading, setSavingLoading] = useState(false);
  const [docs,          setDocs]          = useState(MOCK_DOCS);

  const totalIncome  = sum(income, 'amount');
  const totalExpense = sum(expenses, 'amount');
  const totalInvest  = sum(investments, 'amount');
  const totalSavings = sum(savings, 'amount');
  const balance      = totalIncome - totalExpense;

  const fetchIncome = useCallback(async () => {
    setIncomeLoading(true);
    try {
      const { data } = await getIncomes();
      setIncome(data);
    } catch (e) {
      console.error('Failed to fetch income:', e);
    } finally {
      setIncomeLoading(false);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setExpenseLoading(true);
    try {
      const { data } = await getExpenses();
      setExpenses(data);
    } catch (e) {
      console.error('Failed to fetch expenses:', e);
    } finally {
      setExpenseLoading(false);
    }
  }, []);

  const fetchInvestments = useCallback(async () => {
    setInvestmentLoading(true);
    try {
      const { data } = await getInvestments();
      setInvestments(data);
    } catch (e) {
      console.error('Failed to fetch investments:', e);
    } finally {
      setInvestmentLoading(false);
    }
  }, []);

  const fetchSavings = useCallback(async () => {
    setSavingLoading(true);
    try {
      const { data } = await getSavings();
      setSavings(data);
    } catch (e) {
      console.error('Failed to fetch savings:', e);
    } finally {
      setSavingLoading(false);
    }
  }, []);

  useEffect(() => { fetchIncome(); fetchExpenses(); fetchInvestments(); fetchSavings(); }, [fetchIncome, fetchExpenses, fetchInvestments, fetchSavings]);

  const handleAddIncome = async (entry) => {
    try {
      const { data } = await createIncome(entry);
      setIncome(p => [data, ...p]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      setIncome(p => p.filter(x => x._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleEditIncome = async (entry) => {
    try {
      const { data } = await updateIncome(entry._id, entry);
      setIncome(p => p.map(x => x._id === data._id ? data : x));
    } catch (e) { console.error(e); }
  };

  const handleAddExpense = async (entry) => {
    try {
      let document = '';
      if (entry.document instanceof File) {
        document = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(entry.document);
        });
      }
      const { data } = await createExpense({ ...entry, document });
      setExpenses(p => [data, ...p]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(p => p.filter(x => x._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleEditExpense = async (entry) => {
    try {
      const { data } = await updateExpense(entry._id, entry);
      setExpenses(p => p.map(x => x._id === data._id ? data : x));
    } catch (e) { console.error(e); }
  };

  const handleAddInvestment = async (entry) => {
    try {
      let document = '';
      if (entry.document instanceof File) {
        document = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(entry.document);
        });
      }
      const { data } = await createInvestment({ ...entry, document });
      setInvestments(p => [data, ...p]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteInvestment = async (id) => {
    try {
      await deleteInvestment(id);
      setInvestments(p => p.filter(x => x._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleEditInvestment = async (entry) => {
    try {
      const { data } = await updateInvestment(entry._id, entry);
      setInvestments(p => p.map(x => x._id === data._id ? data : x));
    } catch (e) { console.error(e); }
  };

  const handleAddSaving = async (entry) => {
    try {
      let document = '';
      if (entry.document instanceof File) {
        document = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(entry.document);
        });
      }
      const { data } = await createSaving({ ...entry, document });
      setSavings(p => [data, ...p]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteSaving = async (id) => {
    try {
      await deleteSaving(id);
      setSavings(p => p.filter(x => x._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleEditSaving = async (entry) => {
    try {
      const { data } = await updateSaving(entry._id, entry);
      setSavings(p => p.map(x => x._id === data._id ? data : x));
    } catch (e) { console.error(e); }
  };

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
          <>
            <IncomeStats income={income} />
            <Section title="Income" icon={<TrendingUp size={16} />} stat={`Total: ${fmt(totalIncome)}`}>
              <BudgetEntryForm fields={INCOME_FIELDS} onAdd={handleAddIncome} accentColor={C.sky} />
              {incomeLoading
                ? <div className="bgt-empty">Loading...</div>
                : <BudgetEntryList entries={income} fields={INCOME_FIELDS} onDelete={handleDeleteIncome} onEdit={handleEditIncome} />}
            </Section>
          </>
        )}

        {tab === 'expenses' && (
          <>
            <ExpenseStats expenses={expenses} />
            <Section title="Expenses" icon={<TrendingDown size={16} />} stat={`Total: ${fmt(totalExpense)}`}>
              <BudgetEntryForm fields={EXPENSE_FIELDS} onAdd={handleAddExpense} accentColor={C.violet} />
              {expenseLoading
                ? <div className="bgt-empty">Loading...</div>
                : <BudgetEntryList entries={expenses} fields={EXPENSE_FIELDS} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />}
            </Section>
            <MonthlyCalculator expenses={expenses} income={income} />
          </>
        )}

        {tab === 'investments' && (
          <>
            <InvestmentStats investments={investments} />
            <Section title="Investments" icon={<Landmark size={16} />} stat={`Total Invested: ${fmt(totalInvest)}`}>
              <BudgetEntryForm fields={INVEST_FIELDS} onAdd={handleAddInvestment} accentColor={C.blue} />
              {investmentLoading
                ? <div className="bgt-empty">Loading...</div>
                : <BudgetEntryList entries={investments} fields={INVEST_FIELDS} onDelete={handleDeleteInvestment} onEdit={handleEditInvestment} />}
            </Section>
          </>
        )}

        {tab === 'savings' && (
          <>
            <SavingsStats savings={savings} />
            <Section title="Savings" icon={<PiggyBank size={16} />} stat={`Total Saved: ${fmt(totalSavings)}`}>
              <BudgetEntryForm fields={SAVINGS_FIELDS} onAdd={handleAddSaving} accentColor={C.purple} />
              {savingLoading
                ? <div className="bgt-empty">Loading...</div>
                : <BudgetEntryList entries={savings} fields={SAVINGS_FIELDS} onDelete={handleDeleteSaving} onEdit={handleEditSaving} />}
            </Section>
          </>
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
