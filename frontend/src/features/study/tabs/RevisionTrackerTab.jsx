import { useState } from 'react';
import { RotateCcw, Plus, Folder, FolderOpen, Trash2, ChevronRight } from 'lucide-react';
import { usePlanner, usePlanItems } from '../hooks/usePlanner';

// ── Reusable modal ────────────────────────────────────────────────────────────
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

// ── Folder contents: sub-folders + topics with revision counter ───────────────
function FolderView({ folder, onNavigate }) {
  const parentId = folder._id;
  const { plans: subFolders, loading: fLoading, addPlan, removePlan } = usePlanner(parentId, 'revision');
  const { items, loading: iLoading, addItem, removeItem, incrementItem } = usePlanItems(parentId);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const handleAddFolder = async (name) => {
    setShowFolderModal(false);
    await addPlan(name);
  };

  const handleAddTopic = async () => {
    const text = topicInput.trim();
    if (!text) return;
    setTopicInput('');
    await addItem(text);
  };

  return (
    <div className="tab-container">
      {/* Sub-folders */}
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

      {/* Topics */}
      <div className="tab-header" style={{ marginTop: 8 }}>
        <div className="tab-header__left">
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)' }}>Topics</span>
        </div>
      </div>

      <div className="planner-input-row">
        <input
          className="modal__input"
          placeholder="Add a topic to revise…"
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
        <div className="revision-list">
          {items.map(item => (
            <div key={item._id} className="revision-row">
              <span className="revision-row__name">{item.text}</span>
              <div className="revision-counter">
                <button
                  className="revision-counter__btn"
                  onClick={() => incrementItem(item._id)}
                  title="Mark as revised"
                >
                  <RotateCcw size={14} />
                </button>
                <span className="revision-counter__count">{item.revisionCount ?? 0}</span>
                <span className="revision-counter__label">
                  revision{(item.revisionCount ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <button className="icon-btn icon-btn--danger" onClick={() => removeItem(item._id)}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showFolderModal && (
        <NameModal
          title="New Folder"
          placeholder="Folder name…"
          onSave={handleAddFolder}
          onClose={() => setShowFolderModal(false)}
        />
      )}
    </div>
  );
}

// ── Root view ─────────────────────────────────────────────────────────────────
function RootView({ onNavigate }) {
  const { plans, loading, addPlan, removePlan } = usePlanner(null, 'revision');
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (name) => {
    setShowModal(false);
    await addPlan(name);
  };

  if (loading) return <div className="tab-loading">Loading revision tracker…</div>;

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <RotateCcw size={18} />
          <h2>Revision Tracker</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> New Folder
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="tab-empty">
          <RotateCcw size={40} />
          <p>No folders yet — create your first folder.</p>
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
          title="New Folder"
          placeholder="Folder name…"
          onSave={handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ── Main tab with breadcrumb stack ────────────────────────────────────────────
export default function RevisionTrackerTab() {
  const [stack, setStack] = useState([]);

  const navigate = (folder) => setStack(s => [...s, folder]);
  const goTo     = (idx)    => setStack(s => s.slice(0, idx + 1));
  const goRoot   = ()       => setStack([]);

  const current = stack[stack.length - 1] ?? null;

  return (
    <div className="tab-container">
      {stack.length > 0 && (
        <nav className="planner-breadcrumb">
          <button className="planner-bc__item" onClick={goRoot}>Revision Tracker</button>
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

      {current ? (
        <FolderView folder={current} onNavigate={navigate} />
      ) : (
        <RootView onNavigate={navigate} />
      )}
    </div>
  );
}
