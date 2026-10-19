import { useState } from 'react';
import { ClipboardList, Plus, Folder, FolderOpen, Trash2, ChevronRight } from 'lucide-react';
import { usePlanner, usePlanItems } from '../hooks/usePlanner';

const TYPE = 'mock-test';

function NameModal({ title, placeholder, onSave, onClose }) {
  const [name, setName] = useState('');
  const save = () => { if (name.trim()) onSave(name.trim()); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">
          <input
            className="modal__input"
            placeholder={placeholder}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            autoFocus
          />
        </div>
        <div className="modal__footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
}

function FolderView({ folder, onNavigate }) {
  const { plans: subFolders, loading: fLoading, addPlan, removePlan } = usePlanner(folder._id, TYPE);
  const { items, loading: iLoading, addItem, removeItem, toggleItem } = usePlanItems(folder._id);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const handleAddTopic = async () => {
    const text = topicInput.trim();
    if (!text) return;
    setTopicInput('');
    await addItem(text);
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <FolderOpen size={16} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)' }}>Folders</span>
        </div>
        <button className="btn-ghost" onClick={() => setShowFolderModal(true)}>
          <Plus size={13} /> New Folder
        </button>
      </div>

      {fLoading ? (
        <div className="tab-loading">Loading…</div>
      ) : subFolders.length === 0 ? (
        <p className="planner-empty-hint">No sub-folders yet.</p>
      ) : (
        <div className="planner-folder-grid">
          {subFolders.map(f => (
            <div key={f._id} className="planner-folder" onClick={() => onNavigate(f)}>
              <Folder size={28} className="planner-folder__icon" />
              <span className="planner-folder__name">{f.name}</span>
              <button
                className="icon-btn icon-btn--danger planner-folder__delete"
                onClick={e => { e.stopPropagation(); removePlan(f._id); }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="tab-header" style={{ marginTop: 8 }}>
        <div className="tab-header__left">
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)' }}>Topics</span>
        </div>
      </div>

      <div className="planner-input-row">
        <input
          className="modal__input"
          placeholder="Add a mock test topic…"
          value={topicInput}
          onChange={e => setTopicInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
        />
        <button className="btn-primary" onClick={handleAddTopic}><Plus size={14} /> Add</button>
      </div>

      {iLoading ? (
        <div className="tab-loading">Loading…</div>
      ) : items.length === 0 ? (
        <p className="planner-empty-hint">No topics yet.</p>
      ) : (
        <ul className="planner-item-list">
          {items.map(item => (
            <li key={item._id} className={`planner-item ${item.completed ? 'planner-item--done' : ''}`}>
              <button
                className={`planner-checkbox ${item.completed ? 'planner-checkbox--checked' : ''}`}
                onClick={() => toggleItem(item._id)}
              >
                {item.completed && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <span className="planner-item__text">{item.text}</span>
              <button className="icon-btn icon-btn--danger" onClick={() => removeItem(item._id)}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showFolderModal && (
        <NameModal
          title="New Folder"
          placeholder="Folder name…"
          onSave={async (name) => { setShowFolderModal(false); await addPlan(name); }}
          onClose={() => setShowFolderModal(false)}
        />
      )}
    </div>
  );
}

function RootView({ onNavigate }) {
  const { plans, loading, addPlan, removePlan } = usePlanner(null, TYPE);
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div className="tab-loading">Loading mock tests…</div>;

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <ClipboardList size={18} />
          <h2>Mock Tests</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="tab-empty">
          <ClipboardList size={40} />
          <p>No mock test plans yet — create your first plan.</p>
        </div>
      ) : (
        <div className="planner-folder-grid">
          {plans.map(plan => (
            <div key={plan._id} className="planner-folder" onClick={() => onNavigate(plan)}>
              <Folder size={32} className="planner-folder__icon" />
              <span className="planner-folder__name">{plan.name}</span>
              <button
                className="icon-btn icon-btn--danger planner-folder__delete"
                onClick={e => { e.stopPropagation(); removePlan(plan._id); }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <NameModal
          title="New Plan"
          placeholder="Plan name…"
          onSave={async (name) => { setShowModal(false); await addPlan(name); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function MockTestsTab() {
  const [stack, setStack] = useState([]);
  const navigate = (folder) => setStack(s => [...s, folder]);
  const goTo     = (idx)    => setStack(s => s.slice(0, idx + 1));
  const goRoot   = ()       => setStack([]);
  const current  = stack[stack.length - 1] ?? null;

  return (
    <div className="tab-container">
      {stack.length > 0 && (
        <nav className="planner-breadcrumb">
          <button className="planner-bc__item" onClick={goRoot}>Mock Tests</button>
          {stack.map((f, i) => (
            <span key={f._id} className="planner-bc__row">
              <ChevronRight size={13} className="planner-bc__sep" />
              {i < stack.length - 1 ? (
                <button className="planner-bc__item" onClick={() => goTo(i)}>{f.name}</button>
              ) : (
                <span className="planner-bc__item planner-bc__item--active">{f.name}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      {current ? <FolderView folder={current} onNavigate={navigate} /> : <RootView onNavigate={navigate} />}
    </div>
  );
}
