import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare, Plus, Bell, Pencil, Trash2,
  Check, X, ChevronDown, ChevronUp, AlertCircle, Clock,
  Tag, Calendar, Flag, Filter, Repeat, ArrowLeft
} from 'lucide-react';
import useReminderScheduler from '../../hooks/useReminderScheduler';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo, logComplete, getDeletedTodos, permanentDeleteTodo } from '../../api/todo/index.js';
import TodoDetail from './TodoDetail';
import './TodoPage.css';

// ── palette ────────────────────────────────────────────────
const C = {
  indigo: '#343090',
  violet: '#5f59f7',
  blue:   '#6592fd',
  sky:    '#44c2fd',
  purple: '#8c61ff',
};

const PRIORITY = {
  High:   { color: C.purple, label: 'High' },
  Medium: { color: C.blue,   label: 'Medium' },
  Low:    { color: C.sky,    label: 'Low' },
};

const CATEGORIES = ['Study', 'Exam', 'Career', 'Health', 'Personal', 'Other'];
const TABS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
const TAB_PATHS = {
  Daily:   '/dashboard/todo/daily',
  Weekly:  '/dashboard/todo/weekly',
  Monthly: '/dashboard/todo/monthly',
  Yearly:  '/dashboard/todo/yearly',
};

const REPEAT_OPTIONS = ['none', 'daily', 'weekly', 'monthly', 'yearly'];

const EMPTY_DRAFT = {
  title: '', priority: 'Medium', dueDate: '', category: 'Personal',
  reminder: '', reminderTime: '', reminderEnabled: false,
  completed: false, overdue: false, repeat: 'none', taskType: 'ONE_TIME',
  description: '', frequencyDays: [],
};

// ── helpers ────────────────────────────────────────────────
function isInTab(task, tab) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // recurring tasks: show based on their repeat cycle
  if (task.repeat && task.repeat !== 'none') {
    const due = task.dueDate ? new Date(task.dueDate) : null;
    // only show if task has started (dueDate is today or in the past, or no dueDate)
    if (due && due > new Date(startOfDay.getTime() + 86400000 - 1)) return false;
    if (task.repeat === 'daily')   return true; // daily repeats show in all tabs
    if (task.repeat === 'weekly')  return tab === 'Weekly' || tab === 'Monthly' || tab === 'Yearly';
    if (task.repeat === 'monthly') return tab === 'Monthly' || tab === 'Yearly';
    if (task.repeat === 'yearly')  return tab === 'Yearly';
  }

  // one-time tasks: filter by dueDate
  if (!task.dueDate) return tab === 'Daily'; // no due date → only show in Daily
  const due = new Date(task.dueDate);
  if (isNaN(due)) return true;

  if (tab === 'Daily') {
    const endOfDay = new Date(startOfDay.getTime() + 86400000 - 1);
    return due >= startOfDay && due <= endOfDay;
  }
  if (tab === 'Weekly') {
    const startOfWeek = new Date(startOfDay.getTime() - now.getDay() * 86400000);
    const endOfWeek   = new Date(startOfWeek.getTime() + 7 * 86400000 - 1);
    return due >= startOfWeek && due <= endOfWeek;
  }
  if (tab === 'Monthly') {
    return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
  }
  if (tab === 'Yearly') {
    return due.getFullYear() === now.getFullYear();
  }
  return false;
}

function fmtDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(str) {
  if (!str) return '';
  return new Date(str).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ── TaskForm ───────────────────────────────────────────────
function TaskForm({ draft, onChange, onSave, onCancel, isEdit }) {
  const [customCat, setCustomCat] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const addCustomCat = () => {
    const v = customCat.trim();
    if (v) { onChange('category', v); setCustomCat(''); setShowCustom(false); }
  };

  return (
    <div className="td-form">
      <div className="td-form-row">
        <input
          className="td-input td-input--grow"
          placeholder="Task title *"
          value={draft.title}
          onChange={e => onChange('title', e.target.value)}
        />
        <select className="td-input" value={draft.priority} onChange={e => onChange('priority', e.target.value)}>
          {Object.keys(PRIORITY).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="td-form-row">
        <div className="td-input-group">
          <Calendar size={13} className="td-input-icon" />
          <input
            className="td-input td-input--icon"
            type="datetime-local"
            value={draft.dueDate}
            onChange={e => onChange('dueDate', e.target.value)}
            placeholder="Due date"
          />
        </div>
        <div className="td-cat-wrap">
          <select
            className="td-input"
            value={CATEGORIES.includes(draft.category) ? draft.category : '__custom__'}
            onChange={e => {
              if (e.target.value === '__custom__') setShowCustom(true);
              else { onChange('category', e.target.value); setShowCustom(false); }
            }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            {!CATEGORIES.includes(draft.category) && (
              <option value={draft.category}>{draft.category}</option>
            )}
            <option value="__custom__">+ Custom…</option>
          </select>
          {showCustom && (
            <div className="td-custom-cat">
              <input
                className="td-input"
                placeholder="Category name"
                value={customCat}
                onChange={e => setCustomCat(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomCat()}
              />
              <button className="td-btn-icon" onClick={addCustomCat}><Check size={13} /></button>
              <button className="td-btn-icon" onClick={() => setShowCustom(false)}><X size={13} /></button>
            </div>
          )}
        </div>
      </div>

      {/* repeat */}
      <div className="td-form-row td-repeat-row">
        <label className="td-toggle-label"><Repeat size={13} /> Repeat</label>
        <div className="td-repeat-options">
          {REPEAT_OPTIONS.map(r => (
            <button
              key={r}
              type="button"
              className={`td-repeat-btn${draft.repeat === r ? ' active' : ''}`}
              onClick={() => { onChange('repeat', r); if (r === 'none') onChange('frequencyDays', []); }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* frequency days — only for recurring */}
      {draft.repeat && draft.repeat !== 'none' && (
        <div className="td-form-row td-freq-picker-row">
          <label className="td-toggle-label">Days</label>
          <div className="td-freq-picker">
            {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(d => {
              const active = (draft.frequencyDays || []).includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  className={`td-freq-day-btn${active ? ' active' : ''}`}
                  onClick={() => {
                    const cur = draft.frequencyDays || [];
                    onChange('frequencyDays', active ? cur.filter(x => x !== d) : [...cur, d]);
                  }}
                  title={d}
                >
                  {d.slice(0,2)}
                </button>
              );
            })}
            {(draft.frequencyDays || []).length === 0 && (
              <span className="td-freq-every-day">Every day</span>
            )}
          </div>
        </div>
      )}

      {/* reminder */}
      <div className="td-reminder-row">
        <label className="td-toggle-label">
          <input
            type="checkbox"
            checked={draft.reminderEnabled}
            onChange={e => onChange('reminderEnabled', e.target.checked)}
          />
          <Bell size={13} />
          Set Reminder
        </label>
        {draft.reminderEnabled && (
          <div className="td-form-row td-reminder-inputs">
            {draft.repeat && draft.repeat !== 'none' ? (
              /* repeating: pick a time-of-day, fires every cycle at this time */
              <div className="td-input-group">
                <Clock size={13} className="td-input-icon" />
                <input
                  className="td-input td-input--icon"
                  type="time"
                  value={draft.reminderTime}
                  onChange={e => onChange('reminderTime', e.target.value)}
                  placeholder="Reminder time"
                />
              </div>
            ) : (
              /* one-off: full datetime */
              <>
                <div className="td-input-group">
                  <Clock size={13} className="td-input-icon" />
                  <input
                    className="td-input td-input--icon"
                    type="datetime-local"
                    value={draft.reminder}
                    onChange={e => onChange('reminder', e.target.value)}
                  />
                </div>
                <div className="td-quick-reminders">
                  {[15, 30, 60].map(m => (
                    <button
                      key={m}
                      className="td-quick-btn"
                      onClick={() => {
                        const t = new Date(Date.now() + m * 60000);
                        const local = new Date(t.getTime() - t.getTimezoneOffset() * 60000)
                          .toISOString().slice(0, 16);
                        onChange('reminder', local);
                      }}
                    >
                      +{m}m
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <textarea
        className="td-input td-textarea"
        placeholder="Description (optional)"
        value={draft.description || ''}
        onChange={e => onChange('description', e.target.value)}
        rows={3}
      />

      <div className="td-form-actions">
        <button className="td-btn-primary" onClick={onSave}>
          {isEdit ? 'Update' : 'Add Task'}
        </button>
        <button className="td-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── TaskCard ───────────────────────────────────────────────
function TaskCard({ task, onComplete, onEdit, onDelete, onSelect, selected }) {
  const p = PRIORITY[task.priority] || PRIORITY.Medium;
  return (
    <div className="td-card-wrap">
      <div className={`td-card ${task.completed ? 'td-card--done' : ''} ${task.overdue && !task.completed ? 'td-card--overdue' : ''}`}>
        <div className="td-card-left">
          <button
            className={`td-check ${task.completed ? 'td-check--done' : ''}`}
            onClick={() => onComplete(task.id)}
            title={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && <Check size={11} />}
          </button>
        </div>

        <div className="td-card-body">
          <div className="td-card-top">
            <span className={`td-card-title ${task.completed ? 'td-card-title--done' : ''}`} style={{ cursor: 'pointer' }} onClick={() => onSelect(task)}>{task.title}</span>
            {task.overdue && !task.completed && (
              <span className="td-overdue-badge"><AlertCircle size={11} /> Overdue</span>
            )}
          </div>
          <div className="td-card-meta">
            <span className="td-priority-tag" style={{ background: `${p.color}18`, color: p.color }}>
              <Flag size={10} /> {p.label}
            </span>
            <span className="td-cat-tag"><Tag size={10} /> {task.category}</span>
            {task.dueDate && (
              <span className="td-date-tag"><Calendar size={10} /> {fmtDate(task.dueDate)}</span>
            )}
            {task.reminderEnabled && task.repeat && task.repeat !== 'none' && task.reminderTime && (
              <span className="td-reminder-tag"><Bell size={10} /> {task.reminderTime} · {task.repeat}</span>
            )}
            {task.reminderEnabled && (!task.repeat || task.repeat === 'none') && task.reminder && (
              <span className="td-reminder-tag"><Bell size={10} /> {fmtDateTime(task.reminder)}</span>
            )}
            {task.repeat && task.repeat !== 'none' && (
              <span className="td-repeat-tag"><Repeat size={10} /> {task.repeat}</span>
            )}
          </div>
          <div className="td-card-actions">
            <button className="td-detail-btn" onClick={() => onSelect(task)}>Task Detail</button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <button className="td-icon-btn" onClick={() => onEdit(task)} title="Edit"><Pencil size={13} /></button>
              <button className="td-icon-btn td-icon-btn--red" onClick={() => onDelete(task.id)} title="Delete"><Trash2 size={13} /></button>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="td-inline-detail">
          <TodoDetail key={task.id} task={task} onClose={() => onSelect(task)} />
        </div>
      )}
    </div>
  );
}

// ── DeletedPage ───────────────────────────────────────────
const TRASH_RANGES = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

function isInTrashRange(task, range) {
  const d = new Date(task.deletedAt);
  if (isNaN(d)) return false;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === 'Daily') {
    const endOfDay = new Date(startOfDay.getTime() + 86400000 - 1);
    return d >= startOfDay && d <= endOfDay;
  }
  if (range === 'Weekly') {
    const startOfWeek = new Date(startOfDay.getTime() - now.getDay() * 86400000);
    return d >= startOfWeek;
  }
  if (range === 'Monthly') {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }
  return d.getFullYear() === now.getFullYear();
}

function DeletedPage({ onBack }) {
  const [range, setRange] = useState('Daily');
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getDeletedTodos()
      .then(r => setDeleted(r.data.data.map(t => ({ ...t, id: t._id }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePermanentDelete = async (id) => {
    try {
      await permanentDeleteTodo(id);
      setDeleted(p => p.filter(t => t.id !== id));
    } catch {}
  };

  const rangeFiltered = deleted.filter(t => isInTrashRange(t, range));
  const allCategories = [...new Set(rangeFiltered.map(t => t.category).filter(Boolean))];
  const filtered = rangeFiltered.filter(t =>
    (filterPriority === 'all' || t.priority === filterPriority) &&
    (filterCategory === 'all' || t.category === filterCategory)
  );

  return (
    <div className="td-page">
      <div className="td-header">
        <button className="td-back-btn" onClick={onBack}>Back</button>
        <div className="td-header-left">
          <Trash2 size={20} color="#ef4444" />
          <h1 className="td-page-title">Deleted Tasks</h1>
        </div>
        <span className="td-summary-num" style={{ color: '#ef4444', marginLeft: 'auto' }}>{filtered.length}</span>
      </div>

      <div className="td-tabs">
        {TRASH_RANGES.map(r => (
          <button key={r} className={`td-tab ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{r}</button>
        ))}
        <button className="td-filter-toggle" onClick={() => setShowFilters(s => !s)}>
          <Filter size={13} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="td-filters">
          <select className="td-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            {Object.keys(PRIORITY).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="td-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(filterPriority !== 'all' || filterCategory !== 'all') && (
            <button className="td-clear-filter" onClick={() => { setFilterPriority('all'); setFilterCategory('all'); }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      <div className="td-body">
        {loading ? (
          <div className="td-empty"><p>Loading…</p></div>
        ) : filtered.length === 0 ? (
          <div className="td-empty">
            <Trash2 size={32} strokeWidth={1.2} />
            <p>No deleted tasks for this period</p>
          </div>
        ) : (
          <div className="td-list">
            {filtered.map(t => {
              const p = PRIORITY[t.priority] || PRIORITY.Medium;
              return (
                <div key={t.id} className="td-card" style={{ maxWidth: 400, opacity: 0.8 }}>
                  <div className="td-card-body">
                    <div className="td-card-top">
                      <span className="td-card-title td-card-title--done">{t.title}</span>
                    </div>
                    <div className="td-card-meta">
                      <span className="td-priority-tag" style={{ background: `${p.color}18`, color: p.color }}>
                        <Flag size={10} /> {t.priority}
                      </span>
                      <span className="td-cat-tag"><Tag size={10} /> {t.category}</span>
                      <span className="td-date-tag" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                        <Trash2 size={10} /> Deleted {fmtDate(t.deletedAt)}
                      </span>
                    </div>
                    <div className="td-card-actions">
                      <button className="td-trash-delete-btn" onClick={() => handlePermanentDelete(t.id)}>
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CompletedPage ──────────────────────────────────────────
const COMPLETED_RANGES = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

function isInCompletedRange(task, range) {
  const completedAt = new Date(task.updatedAt || task.dueDate);
  if (isNaN(completedAt)) return range === 'Yearly';
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === 'Daily') {
    const endOfDay = new Date(startOfDay.getTime() + 86400000 - 1);
    return completedAt >= startOfDay && completedAt <= endOfDay;
  }
  if (range === 'Weekly') {
    const startOfWeek = new Date(startOfDay.getTime() - now.getDay() * 86400000);
    return completedAt >= startOfWeek;
  }
  if (range === 'Monthly') {
    return completedAt.getMonth() === now.getMonth() && completedAt.getFullYear() === now.getFullYear();
  }
  return completedAt.getFullYear() === now.getFullYear();
}

function CompletedPage({ tasks, onBack, onSelect, onComplete, onDelete }) {
  const [range, setRange] = useState('Daily');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const allCategories = [...new Set(tasks.map(t => t.category))];

  const filtered = tasks.filter(t =>
    t.completed &&
    isInCompletedRange(t, range) &&
    (filterPriority === 'all' || t.priority === filterPriority) &&
    (filterCategory === 'all' || t.category === filterCategory)
  );

  return (
    <div className="td-page">
      <div className="td-header">
        <button className="td-back-btn" onClick={onBack}>Back</button>
        <div className="td-header-left">
          <CheckSquare size={20} color={C.violet} />
          <h1 className="td-page-title">Completed Tasks</h1>
        </div>
        <span className="td-summary-num" style={{ color: C.sky, marginLeft: 'auto' }}>{filtered.length}</span>
      </div>

      <div className="td-tabs">
        {COMPLETED_RANGES.map(r => (
          <button key={r} className={`td-tab ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{r}</button>
        ))}
        <button className="td-filter-toggle" onClick={() => setShowFilters(s => !s)}>
          <Filter size={13} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="td-filters">
          <select className="td-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            {Object.keys(PRIORITY).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="td-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(filterPriority !== 'all' || filterCategory !== 'all') && (
            <button className="td-clear-filter" onClick={() => { setFilterPriority('all'); setFilterCategory('all'); }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      <div className="td-body">
        {filtered.length === 0 ? (
          <div className="td-empty">
            <CheckSquare size={32} strokeWidth={1.2} />
            <p>No completed tasks for this period</p>
          </div>
        ) : (
          <div className="td-list">
            {filtered.map(t => (
              <TaskCard key={t.id} task={t} onComplete={onComplete} onEdit={() => {}} onDelete={onDelete} onSelect={onSelect} selected={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TaskList ───────────────────────────────────────────────
function TaskList({ tasks, tab, filterPriority, filterCategory, onComplete, onEdit, onDelete, onSelect, selectedId }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const tabTasks = tasks.filter(t => isInTab(t, tab));
  const filtered = tabTasks.filter(t =>
    (filterPriority === 'all' || t.priority === filterPriority) &&
    (filterCategory === 'all' || t.category === filterCategory)
  );

  const pending   = filtered.filter(t => !t.completed);
  const completed = filtered.filter(t => t.completed);

  useEffect(() => {
    if (pending.length === 0 && completed.length > 0) {
      setAllDone(true);
    } else {
      setAllDone(false);
    }
  }, [pending.length, completed.length]);

  useEffect(() => {
    if (selectedId && completed.find(t => t.id === selectedId)) {
      setShowCompleted(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  if (tabTasks.length === 0) {
    return (
      <div className="td-empty">
        <CheckSquare size={32} strokeWidth={1.2} />
        <p>No tasks yet — add your first one</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="td-empty">
        <CheckSquare size={32} strokeWidth={1.2} />
        <p>No tasks match the selected filters</p>
      </div>
    );
  }

  const renderCard = (t) => (
    <TaskCard key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} selected={selectedId === t.id} />
  );

  return (
    <div className="td-list">
      {allDone && (
        <div className="td-empty td-empty--sm">All tasks completed!</div>
      )}
      {pending.map(t => renderCard(t))}
    </div>
  );
}

// ── ReminderToast ──────────────────────────────────────────
function ReminderToast({ toasts, onDismiss, onSnooze, onMarkDone }) {
  if (!toasts.length) return null;
  return (
    <div className="td-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="td-toast">
          <Bell size={15} className="td-toast-icon" />
          <div className="td-toast-body">
            <span className="td-toast-title">{t.task.title}</span>
            <span className="td-toast-sub">Reminder</span>
          </div>
          <div className="td-toast-actions">
            <button className="td-toast-btn td-toast-btn--done" onClick={() => onMarkDone(t)}>Done</button>
            <button className="td-toast-btn" onClick={() => onSnooze(t)}>Snooze 10m</button>
            <button className="td-toast-close" onClick={() => onDismiss(t.id)}><X size={12} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── main page ──────────────────────────────────────────────
export default function TodoPage({ tab: initialTab = 'Daily' }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const switchTab = (t) => { setTab(t); navigate(TAB_PATHS[t]); };

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    getTodos()
      .then(r => setTasks(r.data.data.map(t => ({ ...t, id: t._id }))))
      .catch(() => {})
      .finally(() => setLoadingTasks(false));
  }, []);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft]         = useState(EMPTY_DRAFT);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters]       = useState(false);
  const [toasts, setToasts]   = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState(null);

  const setField = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  // ── CRUD ──
  const openAdd = () => { setDraft(EMPTY_DRAFT); setEditingId(null); setShowForm(true); };
  const openEdit = (task) => {
    setDraft({ ...task });
    setEditingId(task.id);
    setShowForm(true);
    setDetailTaskId(null);
  };
  const cancelForm = () => { setShowForm(false); setEditingId(null); };

  const saveTask = async () => {
    if (!draft.title.trim()) return;
    const taskType = draft.repeat && draft.repeat !== 'none' ? 'RECURRING' : 'ONE_TIME';
    const payload = { ...draft, taskType };
    try {
      if (editingId) {
        const r = await updateTodo(editingId, payload);
        const updated = { ...r.data.data, id: r.data.data._id };
        setTasks(p => p.map(t => t.id === editingId ? updated : t));
      } else {
        const r = await createTodo(payload);
        const created = { ...r.data.data, id: r.data.data._id };
        setTasks(p => [...p, created]);
      }
      setShowForm(false);
      setEditingId(null);
      setDraft(EMPTY_DRAFT);
    } catch {}
  };

  const completeTask = async (id) => {
    try {
      const r = await toggleTodo(id);
      const updated = { ...r.data.data, id: r.data.data._id };
      if (updated.completed && !updated.updatedAt) updated.updatedAt = new Date().toISOString();
      setTasks(p => p.map(t => t.id === id ? updated : t));
      if (updated.completed) {
        const today = new Date().toISOString().slice(0, 10);
        await logComplete(id, { date: today, completed: true }).catch(() => {});
      }
    } catch {}
  };
  const selectTask = (task) => {
    setDetailTaskId(prev => prev === task.id ? null : task.id);
  };

  const deleteTask = async (id) => {
    try {
      await deleteTodo(id);
      setDetailTaskId(prev => prev === id ? null : prev);
      setTasks(p => p.filter(t => t.id !== id));
    } catch {}
  };
  const markOverdue = useCallback((id) => setTasks(p => p.map(t => t.id === id ? { ...t, overdue: true } : t)), []);

  // ── reminder scheduler ──
  const handleToast = useCallback(({ task }) => {
    const id = `toast-${task.id}-${Date.now()}`;
    setToasts(p => [...p, { id, task }]);
  }, []);

  const handleFeedPush = useCallback((notification) => {
    // Push to shared notification feed (window event for cross-module consumption)
    window.dispatchEvent(new CustomEvent('app:notification', { detail: notification }));
  }, []);

  useReminderScheduler(tasks, {
    onToast: handleToast,
    onFeedPush: handleFeedPush,
    onMarkOverdue: markOverdue,
  });

  const dismissToast = (id) => setToasts(p => p.filter(t => t.id !== id));
  const snoozeToast  = (toast) => {
    setTasks(p => p.map(t => {
      if (t.id !== toast.task.id) return t;
      const snoozeTime = new Date(Date.now() + 10 * 60000);
      const local = new Date(snoozeTime.getTime() - snoozeTime.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16);
      return { ...t, reminder: local };
    }));
    dismissToast(toast.id);
  };
  const markDoneFromToast = (toast) => {
    completeTask(toast.task.id);
    dismissToast(toast.id);
  };

  // ── summary ──
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay   = new Date(startOfDay.getTime() + 86400000 - 1);
  const pendingToday = tasks.filter(t =>
    !t.completed && (
      !t.dueDate ||
      (new Date(t.dueDate) >= startOfDay && new Date(t.dueDate) <= endOfDay)
    )
  ).length;

  const allCategories = [...new Set(tasks.map(t => t.category))];

  return (
    <div className="td-page">

      {/* ── full detail page view ── */}
      {detailTaskId && (() => {
        const detailTask = tasks.find(t => t.id === detailTaskId);
        return detailTask ? (
          <TodoDetail key={detailTaskId} task={detailTask} onClose={() => setDetailTaskId(null)} />
        ) : null;
      })()}

      {/* ── completed page view ── */}
      {!detailTaskId && showCompleted && (
        <CompletedPage
          tasks={tasks}
          onBack={() => setShowCompleted(false)}
          onSelect={selectTask}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      )}

      {/* ── deleted page view ── */}
      {!detailTaskId && showDeleted && (
        <DeletedPage onBack={() => setShowDeleted(false)} />
      )}

      {/* ── main todo view ── */}
      {!detailTaskId && !showCompleted && !showDeleted && (<>
      {/* ── header ── */}
      <div className="td-header">
        <div className="td-header-row">
          <div className="td-header-left">
            <CheckSquare size={22} color={C.violet} />
            <h1 className="td-page-title">To-Do</h1>
          </div>
          <div className="td-header-actions">
            <button className="td-add-btn" onClick={openAdd}>Add Task</button>
            <button className="td-completed-btn" onClick={() => setShowCompleted(true)}>
              Completed
              {tasks.filter(t => t.completed).length > 0 && (
                <span className="td-completed-btn-count">{tasks.filter(t => t.completed).length}</span>
              )}
            </button>
            <button className="td-trash-btn" onClick={() => setShowDeleted(true)}>Trash</button>
          </div>
        </div>
        <div className="td-summary-strip">
          <span className="td-summary-item">
            <span className="td-summary-num" style={{ color: C.violet }}>{pendingToday}</span>
            <span className="td-summary-label">pending today</span>
          </span>
          <span className="td-summary-item">
            <span className="td-summary-num" style={{ color: C.sky }}>{tasks.filter(t => t.completed).length}</span>
            <span className="td-summary-label">completed</span>
          </span>
          <span className="td-summary-item">
            <span className="td-summary-num" style={{ color: C.purple }}>{tasks.filter(t => t.overdue && !t.completed).length}</span>
            <span className="td-summary-label">overdue</span>
          </span>
        </div>
      </div>

      {/* ── tabs ── */}
      <div className="td-tabs">
        {TABS.map(t => (
          <button key={t} className={`td-tab ${tab === t ? 'active' : ''}`} onClick={() => switchTab(t)}>
            {t}
          </button>
        ))}
        <button className="td-filter-toggle" onClick={() => setShowFilters(s => !s)}>
          <Filter size={13} /> Filters
        </button>
      </div>

      {/* ── filters ── */}
      {showFilters && (
        <div className="td-filters">
          <select className="td-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            {Object.keys(PRIORITY).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="td-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(filterPriority !== 'all' || filterCategory !== 'all') && (
            <button className="td-clear-filter" onClick={() => { setFilterPriority('all'); setFilterCategory('all'); }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {/* ── form ── */}
      {showForm && (
        <TaskForm
          draft={draft}
          onChange={setField}
          onSave={saveTask}
          onCancel={cancelForm}
          isEdit={!!editingId}
        />
      )}

      {/* ── task list ── */}
      <div className="td-body">
        <TaskList
          tasks={tasks}
          tab={tab}
          filterPriority={filterPriority}
          filterCategory={filterCategory}
          onComplete={completeTask}
          onEdit={openEdit}
          onDelete={deleteTask}
          onSelect={selectTask}
          selectedId={detailTaskId}
        />
      </div>

      {/* ── reminder toasts ── */}
      <ReminderToast
        toasts={toasts}
        onDismiss={dismissToast}
        onSnooze={snoozeToast}
        onMarkDone={markDoneFromToast}
      />
      </>)}
    </div>
  );
}
