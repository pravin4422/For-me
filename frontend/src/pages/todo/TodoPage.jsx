import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare, Plus, Bell, Pencil, Trash2,
  Check, X, ChevronDown, ChevronUp, AlertCircle, Clock,
  Tag, Calendar, Flag, Filter, Repeat
} from 'lucide-react';
import useReminderScheduler from '../../hooks/useReminderScheduler';
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
const TABS = ['Daily', 'Weekly', 'Monthly'];
const TAB_PATHS = {
  Daily:   '/dashboard/todo/daily',
  Weekly:  '/dashboard/todo/weekly',
  Monthly: '/dashboard/todo/monthly',
};

const REPEAT_OPTIONS = ['none', 'daily', 'weekly', 'monthly', 'yearly'];

const EMPTY_DRAFT = {
  title: '', priority: 'Medium', dueDate: '', category: 'Personal',
  reminder: '', reminderTime: '', reminderEnabled: false,
  completed: false, overdue: false, repeat: 'none',
};

function nextDueDate(dueDateStr, repeat) {
  if (!dueDateStr || repeat === 'none') return '';
  const d = new Date(dueDateStr);
  if (repeat === 'daily')   d.setDate(d.getDate() + 1);
  if (repeat === 'weekly')  d.setDate(d.getDate() + 7);
  if (repeat === 'monthly') d.setMonth(d.getMonth() + 1);
  if (repeat === 'yearly')  d.setFullYear(d.getFullYear() + 1);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

// ── helpers ────────────────────────────────────────────────
function isInTab(task, tab) {
  if (!task.dueDate) return tab === 'Daily';
  const due = new Date(task.dueDate);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay   = new Date(startOfDay.getTime() + 86400000 - 1);

  if (tab === 'Daily') {
    return due >= startOfDay && due <= endOfDay;
  }
  if (tab === 'Weekly') {
    const day = now.getDay();
    const startOfWeek = new Date(startOfDay.getTime() - day * 86400000);
    const endOfWeek   = new Date(startOfWeek.getTime() + 7 * 86400000 - 1);
    return due >= startOfWeek && due <= endOfWeek;
  }
  if (tab === 'Monthly') {
    return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
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
              onClick={() => onChange('repeat', r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

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

      <div className="td-form-actions">
        <button className="td-btn-primary" onClick={onSave}>
          <Check size={13} /> {isEdit ? 'Update' : 'Add Task'}
        </button>
        <button className="td-btn-ghost" onClick={onCancel}>
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}

// ── TaskCard ───────────────────────────────────────────────
function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const p = PRIORITY[task.priority] || PRIORITY.Medium;
  return (
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
          <span className={`td-card-title ${task.completed ? 'td-card-title--done' : ''}`}>{task.title}</span>
          {task.overdue && !task.completed && (
            <span className="td-overdue-badge"><AlertCircle size={11} /> Overdue</span>
          )}
        </div>
        <div className="td-card-meta">
          <span className="td-priority-tag" style={{ background: `${p.color}18`, color: p.color }}>
            <Flag size={10} /> {p.label}
          </span>
          <span className="td-cat-tag">
            <Tag size={10} /> {task.category}
          </span>
          {task.dueDate && (
            <span className="td-date-tag">
              <Calendar size={10} /> {fmtDate(task.dueDate)}
            </span>
          )}
          {task.reminderEnabled && task.repeat && task.repeat !== 'none' && task.reminderTime && (
            <span className="td-reminder-tag" title={`Repeats ${task.repeat} at ${task.reminderTime}`}>
              <Bell size={10} /> {task.reminderTime} every {task.repeat}
            </span>
          )}
          {task.reminderEnabled && (!task.repeat || task.repeat === 'none') && task.reminder && (
            <span className="td-reminder-tag" title={`Reminder: ${fmtDateTime(task.reminder)}`}>
              <Bell size={10} /> {fmtDateTime(task.reminder)}
            </span>
          )}
          {task.repeat && task.repeat !== 'none' && (
            <span className="td-repeat-tag"><Repeat size={10} /> {task.repeat}</span>
          )}
        </div>
      </div>

      <div className="td-card-actions">
        <button className="td-icon-btn" onClick={() => onEdit(task)} title="Edit"><Pencil size={13} /></button>
        <button className="td-icon-btn td-icon-btn--red" onClick={() => onDelete(task.id)} title="Delete"><Trash2 size={13} /></button>
      </div>
    </div>
  );
}

// ── TaskList ───────────────────────────────────────────────
function TaskList({ tasks, tab, filterPriority, filterCategory, onComplete, onEdit, onDelete }) {
  const [showCompleted, setShowCompleted] = useState(false);

  const tabTasks = tasks.filter(t => isInTab(t, tab));
  const filtered = tabTasks.filter(t =>
    (filterPriority === 'all' || t.priority === filterPriority) &&
    (filterCategory === 'all' || t.category === filterCategory)
  );

  const pending   = filtered.filter(t => !t.completed);
  const completed = filtered.filter(t => t.completed);

  if (tabTasks.length === 0) {
    return (
      <div className="td-empty">
        <CheckSquare size={32} strokeWidth={1.2} />
        <p>No tasks yet — add your first one</p>
      </div>
    );
  }

  return (
    <div className="td-list">
      {pending.length === 0 && completed.length > 0 && (
        <div className="td-empty td-empty--sm">All tasks completed!</div>
      )}
      {pending.map(t => (
        <TaskCard key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />
      ))}

      {completed.length > 0 && (
        <div className="td-completed-section">
          <button className="td-completed-toggle" onClick={() => setShowCompleted(s => !s)}>
            <Check size={13} />
            Completed ({completed.length})
            {showCompleted ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {showCompleted && completed.map(t => (
            <TaskCard key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
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

  const [tasks, setTasks]         = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft]         = useState(EMPTY_DRAFT);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters]       = useState(false);
  const [toasts, setToasts]       = useState([]);

  const setField = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  // ── CRUD ──
  const openAdd = () => { setDraft(EMPTY_DRAFT); setEditingId(null); setShowForm(true); };
  const openEdit = (task) => {
    setDraft({ ...task });
    setEditingId(task.id);
    setShowForm(true);
  };
  const cancelForm = () => { setShowForm(false); setEditingId(null); };

  const saveTask = () => {
    if (!draft.title.trim()) return;
    if (editingId) {
      setTasks(p => p.map(t => t.id === editingId ? { ...t, ...draft } : t));
    } else {
      setTasks(p => [...p, { ...draft, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  };

  const completeTask = (id) => setTasks(prev => {
    const task = prev.find(t => t.id === id);
    if (!task) return prev;
    if (task.completed) return prev.map(t => t.id === id ? { ...t, completed: false } : t);
    const updated = prev.map(t => t.id === id ? { ...t, completed: true, overdue: false } : t);
    if (task.repeat && task.repeat !== 'none') {
      const nextDue = nextDueDate(task.dueDate, task.repeat);
      return [...updated, {
        ...task,
        id: Date.now().toString(),
        completed: false,
        overdue: false,
        dueDate: nextDue,
        // reminderTime (HH:MM) stays the same — scheduler fires it on the new due date
        // reminder (one-off datetime) is cleared since this is now a repeating occurrence
        reminder: '',
      }];
    }
    return updated;
  });
  const deleteTask   = (id) => setTasks(p => p.filter(t => t.id !== id));
  const markOverdue  = useCallback((id) => setTasks(p => p.map(t => t.id === id ? { ...t, overdue: true } : t)), []);

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
    !t.completed && t.dueDate &&
    new Date(t.dueDate) >= startOfDay && new Date(t.dueDate) <= endOfDay
  ).length;

  const allCategories = [...new Set(tasks.map(t => t.category))];

  return (
    <div className="td-page">
      {/* ── header ── */}
      <div className="td-header">
        <div className="td-header-left">
          <CheckSquare size={22} color={C.violet} />
          <h1 className="td-page-title">To-Do</h1>
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
        <button className="td-add-btn" onClick={openAdd}>
          <Plus size={15} /> Add Task
        </button>
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
      <TaskList
        tasks={tasks}
        tab={tab}
        filterPriority={filterPriority}
        filterCategory={filterCategory}
        onComplete={completeTask}
        onEdit={openEdit}
        onDelete={deleteTask}
      />

      {/* ── reminder toasts ── */}
      <ReminderToast
        toasts={toasts}
        onDismiss={dismissToast}
        onSnooze={snoozeToast}
        onMarkDone={markDoneFromToast}
      />
    </div>
  );
}
