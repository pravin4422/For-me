import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, Check, X, ClipboardList, Save, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { getBudgetPlan, saveBudgetPlan, getAllBudgetPlans } from '../../api/budget/budgetPlanApi';
import './BudgetPlanner.css';

const CATEGORIES = [
  'Food & Dining', 'Rent', 'Groceries', 'Transport', 'Utilities',
  'Healthcare', 'Shopping', 'Entertainment', 'Education', 'Travel',
  'Fuel', 'Insurance', 'EMI', 'Savings', 'Investment', 'Other',
];

const PRIORITIES = ['High', 'Medium', 'Low'];
const PRIORITY_COLOR = { High: '#ff8fa3', Medium: '#44c2fd', Low: '#8c61ff' };
const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const EMPTY = { name: '', category: 'Food & Dining', amount: '', priority: 'Medium', notes: '' };

// ── All Months Overview ───────────────────────────────────
function AllMonthsOverview({ allPlans, onSelect }) {
  if (!allPlans.length) return (
    <div className="bp-empty">No saved plans yet — start planning this month!</div>
  );

  return (
    <div className="bp-all-grid">
      {allPlans.map(p => {
        const pct = p.budgetLimit ? Math.min((p.total / p.budgetLimit) * 100, 100) : 0;
        const over = p.budgetLimit > 0 && p.total > p.budgetLimit;
        return (
          <div key={`${p.year}-${p.month}`} className="bp-month-card" onClick={() => onSelect(p.month, p.year)}>
            <div className="bp-mc-header">
              <span className="bp-mc-month">{MONTH_NAMES[p.month]}</span>
              <span className="bp-mc-year">{p.year}</span>
            </div>
            <span className="bp-mc-total" style={{ color: over ? '#ff8fa3' : '#44c2fd' }}>{fmt(p.total)}</span>
            {p.budgetLimit > 0 && (
              <>
                <div className="bp-mc-bar-wrap">
                  <div className="bp-mc-bar-fill" style={{ width: `${pct}%`, background: over ? '#ff8fa3' : 'linear-gradient(90deg,#5f59f7,#44c2fd)' }} />
                </div>
                <div className="bp-mc-meta">
                  <span>Limit: {fmt(p.budgetLimit)}</span>
                  <span className={over ? 'bp-over' : 'bp-remaining'}>{over ? `${fmt(p.total - p.budgetLimit)} over` : `${fmt(p.budgetLimit - p.total)} left`}</span>
                </div>
              </>
            )}
            <span className="bp-mc-count">{p.itemCount} item{p.itemCount !== 1 ? 's' : ''}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function BudgetPlanner({ onSave }) {
  const now = new Date();

  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [showAll,   setShowAll]   = useState(false);

  const [items, setItems]           = useState([]);
  const [budget, setBudget]         = useState('');
  const [editBudget, setEditBudget] = useState(false);
  const [form, setForm]             = useState(EMPTY);
  const [open, setOpen]             = useState(false);
  const [editId, setEditId]         = useState(null);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(true);
  const [loading, setLoading]       = useState(false);
  const [allPlans, setAllPlans]     = useState([]);

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
  const isFuture = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  const totalPlanned = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const budgetLimit  = parseFloat(budget) || 0;
  const remaining    = budgetLimit - totalPlanned;
  const pct          = budgetLimit ? Math.min((totalPlanned / budgetLimit) * 100, 100) : 0;

  const loadPlan = useCallback(async (month, year) => {
    setLoading(true);
    try {
      const { data } = await getBudgetPlan(month, year);
      setItems(data.items || []);
      setBudget(data.budgetLimit ? String(data.budgetLimit) : '');
      setSaved(true);
    } catch (e) {
      console.error('Failed to load budget plan:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllPlans = useCallback(async () => {
    try {
      const { data } = await getAllBudgetPlans();
      setAllPlans(data);
    } catch (e) {
      console.error('Failed to load all plans:', e);
    }
  }, []);

  useEffect(() => { loadPlan(viewMonth, viewYear); }, [viewMonth, viewYear, loadPlan]);
  useEffect(() => { loadAllPlans(); }, [loadAllPlans]);

  const prevMonth = async () => {
    if (!saved && items.length > 0) await saveToDb();
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setOpen(false);
  };

  const nextMonth = async () => {
    if (isFuture) return;
    if (!saved && items.length > 0) await saveToDb();
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setOpen(false);
  };

  const selectMonth = async (month, year) => {
    if (!saved && items.length > 0) await saveToDb();
    setViewMonth(month);
    setViewYear(year);
    setShowAll(false);
    setOpen(false);
  };

  const handle = (k, v) => { setForm(p => ({ ...p, [k]: v })); setSaved(false); };

  const addItem = () => {
    if (!form.name || !form.amount) return;
    if (editId !== null) {
      setItems(p => p.map(i => (i._id === editId || i.tempId === editId) ? { ...i, ...form } : i));
      setEditId(null);
    } else {
      setItems(p => [...p, { ...form, tempId: Date.now() }]);
    }
    setForm(EMPTY);
    setOpen(false);
    setSaved(false);
  };

  const startEdit = (item) => {
    setForm({ name: item.name, category: item.category, amount: item.amount, priority: item.priority, notes: item.notes });
    setEditId(item._id || item.tempId);
    setOpen(true);
    setSaved(false);
  };

  const cancel = () => { setForm(EMPTY); setEditId(null); setOpen(false); };

  const remove = async (item) => {
    const updated = items.filter(i => (i._id || i.tempId) !== (item._id || item.tempId));
    setItems(updated);
    try {
      const { data } = await saveBudgetPlan({
        month: viewMonth,
        year:  viewYear,
        budgetLimit: parseFloat(budget) || 0,
        items: updated.map(({ tempId, ...rest }) => rest),
      });
      setItems(data.items || []);
      setSaved(true);
      await loadAllPlans();
      if (onSave) await onSave();
    } catch (e) {
      console.error('Failed to delete item:', e);
    }
  };

  const saveToDb = async () => {
    setSaving(true);
    try {
      const { data } = await saveBudgetPlan({
        month: viewMonth,
        year:  viewYear,
        budgetLimit: parseFloat(budget) || 0,
        items: items.map(({ tempId, ...rest }) => rest),
      });
      setItems(data.items || []);
      setSaved(true);
      await loadAllPlans();
      if (onSave) await onSave();
    } catch (e) {
      console.error('Failed to save budget plan:', e);
    } finally {
      setSaving(false);
    }
  };

  const grouped = PRIORITIES.reduce((acc, p) => {
    acc[p] = items.filter(i => i.priority === p);
    return acc;
  }, {});

  return (
    <div className="bp-wrap">
      {/* ── header ── */}
      <div className="bp-header">
        <div className="bp-header-left">
          <ClipboardList size={18} />
          <div>
            <h3>Budget Planner</h3>
            <span className="bp-month">{isCurrentMonth ? 'Current Month' : viewYear === now.getFullYear() ? 'Past Month' : `${viewYear}`}</span>
          </div>
        </div>

        <div className="bp-header-right">
          {/* month navigator */}
          <div className="bp-month-nav">
            <button className="bp-icon-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
            <span className="bp-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button className="bp-icon-btn" onClick={nextMonth} disabled={isFuture} style={{ opacity: isFuture ? 0.3 : 1 }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* toggle all months view */}
          <button className={`bp-toggle-btn ${showAll ? 'active' : ''}`} onClick={() => setShowAll(v => !v)}>
            <LayoutGrid size={14} /> {showAll ? 'Hide Overview' : 'All Months'}
          </button>

          {/* budget limit */}
          <div className="bp-limit-block">
            <span className="bp-limit-label">Budget Limit</span>
            {editBudget ? (
              <div className="bp-limit-edit">
                <input
                  type="number"
                  value={budget}
                  onChange={e => { setBudget(e.target.value); setSaved(false); }}
                  placeholder="Enter amount"
                  autoFocus
                />
                <button className="bp-icon-btn green" onClick={() => setEditBudget(false)}><Check size={14} /></button>
                <button className="bp-icon-btn" onClick={() => setEditBudget(false)}><X size={14} /></button>
              </div>
            ) : (
              <div className="bp-limit-display" onClick={() => setEditBudget(true)}>
                <span className="bp-limit-value">{budgetLimit ? fmt(budgetLimit) : 'Set limit'}</span>
                <Pencil size={12} className="bp-limit-edit-icon" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── all months overview ── */}
      {showAll && (
        <div className="bp-all-section">
          <div className="bp-all-title"><LayoutGrid size={14} /> All Months Overview</div>
          <AllMonthsOverview allPlans={allPlans} onSelect={selectMonth} />
        </div>
      )}

      {/* ── summary bar ── */}
      {budgetLimit > 0 && (
        <div className="bp-summary">
          <div className="bp-summary-row">
            <span>Planned</span><span className="bp-planned">{fmt(totalPlanned)}</span>
          </div>
          <div className="bp-summary-row">
            <span>Remaining</span>
            <span className={remaining >= 0 ? 'bp-remaining' : 'bp-over'}>{fmt(Math.abs(remaining))} {remaining < 0 ? 'over' : 'left'}</span>
          </div>
          <div className="bp-bar-wrap">
            <div className="bp-bar-fill" style={{ width: `${pct}%`, background: pct > 90 ? '#ff8fa3' : 'linear-gradient(90deg,#5f59f7,#44c2fd)' }} />
          </div>
          <span className="bp-bar-pct">{pct.toFixed(1)}% of budget planned</span>
        </div>
      )}

      {loading ? (
        <div className="bp-empty">Loading...</div>
      ) : (
        <>
          {/* ── add button / form ── */}
          {!open ? (
            <button className="bp-add-btn" onClick={() => setOpen(true)}>
              <Plus size={15} /> Add Spending Plan
            </button>
          ) : (
            <div className="bp-form">
              <div className="bp-form-grid">
                <div className="bp-field">
                  <label>Item Name *</label>
                  <input value={form.name} onChange={e => handle('name', e.target.value)} placeholder="e.g. Grocery shopping" />
                </div>
                <div className="bp-field">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => handle('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="bp-field">
                  <label>Planned Amount (₹) *</label>
                  <input type="number" value={form.amount} onChange={e => handle('amount', e.target.value)} placeholder="0" />
                </div>
                <div className="bp-field">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => handle('priority', e.target.value)}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="bp-field bp-field-full">
                  <label>Notes</label>
                  <input value={form.notes} onChange={e => handle('notes', e.target.value)} placeholder="Optional note..." />
                </div>
              </div>
              <div className="bp-form-actions">
                <button className="bp-btn-primary" onClick={addItem}><Check size={14} /> {editId ? 'Update' : 'Add'}</button>
                <button className="bp-btn-ghost" onClick={cancel}><X size={14} /> Cancel</button>
              </div>
            </div>
          )}

          {/* ── items list ── */}
          {items.length === 0 ? (
            <div className="bp-empty">No spending plans for {MONTH_NAMES[viewMonth]} {viewYear} — add your first item</div>
          ) : (
            <div className="bp-groups">
              {PRIORITIES.map(priority => grouped[priority].length > 0 && (
                <div key={priority} className="bp-group">
                  <div className="bp-group-label" style={{ color: PRIORITY_COLOR[priority] }}>
                    <span className="bp-group-dot" style={{ background: PRIORITY_COLOR[priority] }} />
                    {priority} Priority
                    <span className="bp-group-count">{grouped[priority].length}</span>
                  </div>
                  <div className="bp-items">
                    {grouped[priority].map(item => (
                      <div key={item._id || item.tempId} className="bp-item" style={{ borderLeftColor: PRIORITY_COLOR[item.priority] }}>
                        <div className="bp-item-info">
                          <span className="bp-item-name">{item.name}</span>
                          <span className="bp-item-cat">{item.category}</span>
                          {item.notes && <span className="bp-item-notes">{item.notes}</span>}
                        </div>
                        <span className="bp-item-amount">{fmt(parseFloat(item.amount) || 0)}</span>
                        <div className="bp-item-actions">
                          <button className="bp-icon-btn" onClick={() => startEdit(item)}><Pencil size={13} /></button>
                          <button className="bp-icon-btn red" onClick={() => remove(item)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── total card — always visible when items exist ── */}
      {items.length > 0 && (
        <div className="bp-total-card">
          <div className="bp-total-stat">
            <span className="bp-total-stat-label">Total Planned</span>
            <span className="bp-total-stat-value" style={{ color: '#44c2fd' }}>{fmt(totalPlanned)}</span>
          </div>
          {budgetLimit > 0 && (
            <>
              <div className="bp-total-divider" />
              <div className="bp-total-stat">
                <span className="bp-total-stat-label">Budget Limit</span>
                <span className="bp-total-stat-value" style={{ color: '#8c61ff' }}>{fmt(budgetLimit)}</span>
              </div>
              <div className="bp-total-divider" />
              <div className="bp-total-stat">
                <span className="bp-total-stat-label">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</span>
                <span className="bp-total-stat-value" style={{ color: remaining >= 0 ? '#4ade80' : '#ff8fa3' }}>
                  {remaining >= 0 ? fmt(remaining) : fmt(Math.abs(remaining))}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── save to DB ── */}
      {!saved && items.length > 0 && (
        <button className="bp-save-btn" onClick={saveToDb} disabled={saving}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save to Database'}
        </button>
      )}
    </div>
  );
}
