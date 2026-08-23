import { useState } from 'react';
import { BookMarked, Plus, Trash2, X, Check, ExternalLink, Search, Filter } from 'lucide-react';
import './CareerPage.css';

const INIT_RESOURCES = [
  { id: 1, title: 'LeetCode — DSA Practice', url: 'https://leetcode.com', category: 'Tool', description: 'Best platform for coding interview prep.' },
  { id: 2, title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', category: 'Guide', description: 'Comprehensive system design guide on GitHub.' },
  { id: 3, title: 'Naukri.com', url: 'https://www.naukri.com', category: 'Tool', description: 'Job listings for IT and non-IT roles in India.' },
  { id: 4, title: 'IndiaBix — Aptitude', url: 'https://www.indiabix.com', category: 'Guide', description: 'Aptitude questions for government and IT exams.' },
  { id: 5, title: 'Resume Tips — Harvard', url: 'https://ocs.fas.harvard.edu/resumes-cvs', category: 'Article', description: 'Harvard OCS resume writing guide.' },
  { id: 6, title: 'Mock Interview — Pramp', url: 'https://www.pramp.com', category: 'Tool', description: 'Free peer-to-peer mock interview platform.' },
  { id: 7, title: 'Coursera — Google IT Support', url: 'https://www.coursera.org/professional-certificates/google-it-support', category: 'Course', description: 'Google IT Support Professional Certificate.' },
  { id: 8, title: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning', category: 'Course', description: 'Professional skill courses with LinkedIn integration.' },
];

const CATEGORIES = ['All', 'Guide', 'Article', 'Tool', 'Course', 'Video', 'Other'];
const CAT_COLOR   = { Guide: '#6366f1', Article: '#0ea5e9', Tool: '#10b981', Course: '#f59e0b', Video: '#ec4899', Other: '#94a3b8' };

const BLANK = { title: '', url: '', category: 'Guide', description: '' };

export default function CareerResources() {
  const [resources, setResources] = useState(INIT_RESOURCES);
  const [category, setCategory]   = useState('All');
  const [search, setSearch]       = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [draft, setDraft]         = useState(BLANK);

  const filtered = resources.filter(r =>
    (category === 'All' || r.category === category) &&
    (search === '' || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const save = () => {
    if (!draft.title.trim() || !draft.url.trim()) return;
    setResources(p => [...p, { ...draft, id: Date.now() }]);
    setDraft(BLANK);
    setShowForm(false);
  };

  const remove = (id) => setResources(p => p.filter(r => r.id !== id));
  const set    = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  return (
    <div className="career-page">
      <div className="career-page-header">
        <div className="career-page-title">
          <BookMarked size={22} />
          <h2>Career Resources</h2>
        </div>
        <button className="career-add-btn" onClick={() => setShowForm(s => !s)}>
          <Plus size={15} /> Add Resource
        </button>
      </div>

      <div className="career-filters">
        <div className="career-search-wrap">
          <Search size={14} />
          <input
            className="career-search"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="career-filter-group">
          <Filter size={14} />
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`career-filter-btn ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* add form */}
      {showForm && (
        <div className="career-inline-form career-inline-form--card">
          <div className="career-form-row">
            <div className="career-form-field">
              <label>Title *</label>
              <input className="career-input" value={draft.title} onChange={e => set('title', e.target.value)} placeholder="Resource title" />
            </div>
            <div className="career-form-field">
              <label>Category</label>
              <select className="career-input" value={draft.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="career-form-field">
            <label>URL *</label>
            <input className="career-input" value={draft.url} onChange={e => set('url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="career-form-field">
            <label>Description</label>
            <input className="career-input" value={draft.description} onChange={e => set('description', e.target.value)} placeholder="Short description..." />
          </div>
          <div className="career-form-actions">
            <button className="career-btn-primary" onClick={save}><Check size={13} /> Save</button>
            <button className="career-btn-ghost" onClick={() => setShowForm(false)}><X size={13} /> Cancel</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="career-empty">No resources match your filter.</div>
      ) : (
        <div className="career-resources-grid">
          {filtered.map(r => (
            <div key={r.id} className="career-resource-card">
              <div className="career-resource-top">
                <span
                  className="career-resource-cat"
                  style={{ background: `${CAT_COLOR[r.category] || '#94a3b8'}18`, color: CAT_COLOR[r.category] || '#94a3b8' }}
                >{r.category}</span>
                <button className="career-icon-btn career-icon-btn--red" onClick={() => remove(r.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="career-resource-title">{r.title}</div>
              {r.description && <div className="career-resource-desc">{r.description}</div>}
              <a href={r.url} target="_blank" rel="noreferrer" className="career-link-btn career-resource-link">
                <ExternalLink size={13} /> Open Resource
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
