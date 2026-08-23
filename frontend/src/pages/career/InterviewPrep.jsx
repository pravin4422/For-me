import { useState } from 'react';
import { ClipboardList, Plus, Trash2, X, Check, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import './CareerPage.css';

const INIT_PREPS = [
  {
    id: 1, companyName: 'TCS', round: 'TCS NQT',
    status: 'In Progress',
    notes: 'Focus on Quantitative Aptitude and Reasoning sections.',
    commonQuestions: 'Time & Work, Number Series, Coding MCQs',
    resourceLinks: 'https://www.indiabix.com',
  },
  {
    id: 2, companyName: 'TCS', round: 'Technical Interview',
    status: 'Not Started',
    notes: 'Revise Java OOP concepts and SQL queries.',
    commonQuestions: 'OOP principles, SQL joins, project explanation',
    resourceLinks: '',
  },
  {
    id: 3, companyName: 'Zoho', round: 'Programming Round',
    status: 'In Progress',
    notes: 'Practice array and string problems on HackerRank.',
    commonQuestions: 'Array manipulation, String reversal, Pattern printing',
    resourceLinks: 'https://www.hackerrank.com',
  },
  {
    id: 4, companyName: 'Zoho', round: 'Technical Interview',
    status: 'Not Started',
    notes: 'Deep dive into C/Java fundamentals.',
    commonQuestions: 'Pointers, Memory management, OOPS',
    resourceLinks: '',
  },
];

const STATUSES = ['Not Started', 'In Progress', 'Done'];
const STATUS_COLOR = {
  'Not Started': { bg: '#f1f5f9', color: '#64748b' },
  'In Progress': { bg: '#fef3c7', color: '#d97706' },
  'Done':        { bg: '#d1fae5', color: '#059669' },
};

const BLANK = { companyName: '', round: '', status: 'Not Started', notes: '', commonQuestions: '', resourceLinks: '' };

export default function InterviewPrep() {
  const [preps, setPreps]       = useState(INIT_PREPS);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [draft, setDraft]       = useState(BLANK);
  const [expanded, setExpanded] = useState(null);
  const [filterCo, setFilterCo] = useState('All');

  const companies = ['All', ...Array.from(new Set(preps.map(p => p.companyName)))];

  const filtered = preps.filter(p => filterCo === 'All' || p.companyName === filterCo);

  // group by company
  const grouped = filtered.reduce((acc, p) => {
    if (!acc[p.companyName]) acc[p.companyName] = [];
    acc[p.companyName].push(p);
    return acc;
  }, {});

  const openAdd  = () => { setDraft(BLANK); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setDraft({ ...p }); setEditing(p.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const save = () => {
    if (!draft.companyName.trim() || !draft.round.trim()) return;
    if (editing) {
      setPreps(p => p.map(x => x.id === editing ? { ...draft, id: editing } : x));
    } else {
      setPreps(p => [...p, { ...draft, id: Date.now() }]);
    }
    closeForm();
  };

  const remove = (id) => setPreps(p => p.filter(x => x.id !== id));
  const set    = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  return (
    <div className="career-page">
      <div className="career-page-header">
        <div className="career-page-title">
          <ClipboardList size={22} />
          <h2>Interview Preparation</h2>
        </div>
        <button className="career-add-btn" onClick={openAdd}>
          <Plus size={15} /> Add Round
        </button>
      </div>

      {/* company filter */}
      <div className="career-filters">
        <div className="career-filter-group">
          {companies.map(c => (
            <button
              key={c}
              className={`career-filter-btn ${filterCo === c ? 'active' : ''}`}
              onClick={() => setFilterCo(c)}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* form modal */}
      {showForm && (
        <div className="career-modal-overlay" onClick={closeForm}>
          <div className="career-modal" onClick={e => e.stopPropagation()}>
            <div className="career-modal-header">
              <h3>{editing ? 'Edit Round' : 'Add Interview Round'}</h3>
              <button className="career-modal-close" onClick={closeForm}><X size={16} /></button>
            </div>
            <div className="career-modal-body">
              <div className="career-form-row">
                <div className="career-form-field">
                  <label>Company Name *</label>
                  <input className="career-input" value={draft.companyName} onChange={e => set('companyName', e.target.value)} placeholder="e.g. TCS" />
                </div>
                <div className="career-form-field">
                  <label>Round / Stage *</label>
                  <input className="career-input" value={draft.round} onChange={e => set('round', e.target.value)} placeholder="e.g. Technical Interview" />
                </div>
              </div>
              <div className="career-form-field">
                <label>Status</label>
                <select className="career-input" value={draft.status} onChange={e => set('status', e.target.value)}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="career-form-field">
                <label>Notes / Prep Plan</label>
                <textarea className="career-input career-textarea" value={draft.notes} onChange={e => set('notes', e.target.value)} placeholder="What to study, mock feedback..." />
              </div>
              <div className="career-form-field">
                <label>Common Questions</label>
                <textarea className="career-input career-textarea" value={draft.commonQuestions} onChange={e => set('commonQuestions', e.target.value)} placeholder="List common questions for this round..." />
              </div>
              <div className="career-form-field">
                <label>Resource Links</label>
                <input className="career-input" value={draft.resourceLinks} onChange={e => set('resourceLinks', e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="career-modal-footer">
              <button className="career-btn-primary" onClick={save}><Check size={14} /> {editing ? 'Update' : 'Save'}</button>
              <button className="career-btn-ghost" onClick={closeForm}><X size={14} /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <div className="career-empty">No interview prep added yet.</div>
      ) : (
        Object.entries(grouped).map(([company, rounds]) => (
          <div key={company} className="career-prep-company-group">
            <div className="career-prep-company-header">
              <ClipboardList size={15} />
              <span>{company}</span>
              <span className="career-count-badge">{rounds.length} rounds</span>
            </div>
            <div className="career-list">
              {rounds.map(p => (
                <div key={p.id} className={`career-card ${expanded === p.id ? 'expanded' : ''}`}>
                  <div className="career-card-main" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                    <div className="career-card-left">
                      <span
                        className="career-status-badge"
                        style={{ background: STATUS_COLOR[p.status].bg, color: STATUS_COLOR[p.status].color }}
                      >{p.status}</span>
                      <div className="career-exam-name">{p.round}</div>
                    </div>
                    <div className="career-card-right">
                      <button className="career-icon-btn" onClick={e => { e.stopPropagation(); openEdit(p); }}><Pencil size={14} /></button>
                      <button className="career-icon-btn career-icon-btn--red" onClick={e => { e.stopPropagation(); remove(p.id); }}><Trash2 size={14} /></button>
                      {expanded === p.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </div>
                  </div>

                  {expanded === p.id && (
                    <div className="career-card-detail">
                      {p.notes && (
                        <div className="career-detail-row">
                          <span className="career-detail-label">Notes</span>
                          <span className="career-detail-value career-notes">{p.notes}</span>
                        </div>
                      )}
                      {p.commonQuestions && (
                        <div className="career-detail-row">
                          <span className="career-detail-label">Common Questions</span>
                          <span className="career-detail-value career-notes">{p.commonQuestions}</span>
                        </div>
                      )}
                      {p.resourceLinks && (
                        <div className="career-detail-links">
                          <a href={p.resourceLinks} target="_blank" rel="noreferrer" className="career-link-btn">
                            Resources
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
