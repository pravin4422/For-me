import { useState } from 'react';
import { Database, Plus, Pencil, Trash2, X, Check, ExternalLink, Search } from 'lucide-react';
import './CareerPage.css';

const INIT = [
  {
    id: 1, name: 'TCS', type: 'Service',
    qualification: 'Any Graduate', eligibility: 'Fresher / 1–3 yrs, 60% throughout',
    requiredSkills: 'Java, SQL, Communication',
    interviewStages: 'TCS NQT, Technical Interview, HR Interview',
    experienceRequirements: 'Fresher / 1–3 yrs',
    careerPageLink: 'https://nextstep.tcs.com',
    jobLinks: 'https://nextstep.tcs.com',
    notes: 'NQT score is the primary filter.',
  },
  {
    id: 2, name: 'Zoho', type: 'Product',
    qualification: 'B.E / B.Tech / Any Degree', eligibility: 'Fresher / 1–5 yrs',
    requiredSkills: 'C/C++/Java, DSA, SQL',
    interviewStages: 'Written Test, Programming Round, Technical (x2), HR',
    experienceRequirements: 'Fresher / 1–5 yrs',
    careerPageLink: 'https://careers.zohocorp.com',
    jobLinks: 'https://careers.zohocorp.com/jobs',
    notes: 'No degree bias. Strong coding skills required.',
  },
];

const BLANK = {
  name: '', type: 'Product', qualification: '', eligibility: '',
  requiredSkills: '', interviewStages: '', experienceRequirements: '',
  careerPageLink: '', jobLinks: '', notes: '',
};

const TYPES = ['Product', 'Service', 'Startup', 'Government'];
const TYPE_COLOR = { Product: '#6366f1', Service: '#0ea5e9', Startup: '#f59e0b', Government: '#10b981' };

export default function CompanyInformation() {
  const [companies, setCompanies] = useState(INIT);
  const [search, setSearch]       = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [draft, setDraft]         = useState(BLANK);
  const [expanded, setExpanded]   = useState(null);

  const openAdd = () => { setDraft(BLANK); setEditing(null); setShowForm(true); };
  const openEdit = (c) => { setDraft({ ...c }); setEditing(c.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const save = () => {
    if (!draft.name.trim()) return;
    if (editing) {
      setCompanies(p => p.map(c => c.id === editing ? { ...draft, id: editing } : c));
    } else {
      setCompanies(p => [...p, { ...draft, id: Date.now() }]);
    }
    closeForm();
  };

  const remove = (id) => setCompanies(p => p.filter(c => c.id !== id));

  const set = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="career-page">
      <div className="career-page-header">
        <div className="career-page-title">
          <Database size={22} />
          <h2>Company Information</h2>
        </div>
        <button className="career-add-btn" onClick={openAdd}>
          <Plus size={15} /> Add Company
        </button>
      </div>

      <div className="career-filters">
        <div className="career-search-wrap">
          <Search size={14} />
          <input
            className="career-search"
            placeholder="Search company or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* form modal */}
      {showForm && (
        <div className="career-modal-overlay" onClick={closeForm}>
          <div className="career-modal" onClick={e => e.stopPropagation()}>
            <div className="career-modal-header">
              <h3>{editing ? 'Edit Company' : 'Add Company'}</h3>
              <button className="career-modal-close" onClick={closeForm}><X size={16} /></button>
            </div>
            <div className="career-modal-body">
              <div className="career-form-row">
                <div className="career-form-field">
                  <label>Company Name *</label>
                  <input className="career-input" value={draft.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Google" />
                </div>
                <div className="career-form-field">
                  <label>Type</label>
                  <select className="career-input" value={draft.type} onChange={e => set('type', e.target.value)}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="career-form-row">
                <div className="career-form-field">
                  <label>Qualification</label>
                  <input className="career-input" value={draft.qualification} onChange={e => set('qualification', e.target.value)} placeholder="e.g. B.E / B.Tech" />
                </div>
                <div className="career-form-field">
                  <label>Eligibility</label>
                  <input className="career-input" value={draft.eligibility} onChange={e => set('eligibility', e.target.value)} placeholder="e.g. Age 21–30, 60% throughout" />
                </div>
              </div>
              <div className="career-form-field">
                <label>Required Skills (comma separated)</label>
                <input className="career-input" value={draft.requiredSkills} onChange={e => set('requiredSkills', e.target.value)} placeholder="e.g. Java, DSA, SQL" />
              </div>
              <div className="career-form-field">
                <label>Interview Stages (comma separated)</label>
                <input className="career-input" value={draft.interviewStages} onChange={e => set('interviewStages', e.target.value)} placeholder="e.g. Online Test, Technical, HR" />
              </div>
              <div className="career-form-row">
                <div className="career-form-field">
                  <label>Experience Requirements</label>
                  <input className="career-input" value={draft.experienceRequirements} onChange={e => set('experienceRequirements', e.target.value)} placeholder="e.g. Fresher / 1–3 yrs" />
                </div>
                <div className="career-form-field">
                  <label>Career Page Link</label>
                  <input className="career-input" value={draft.careerPageLink} onChange={e => set('careerPageLink', e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="career-form-field">
                <label>Job Links</label>
                <input className="career-input" value={draft.jobLinks} onChange={e => set('jobLinks', e.target.value)} placeholder="https://..." />
              </div>
              <div className="career-form-field">
                <label>Notes</label>
                <textarea className="career-input career-textarea" value={draft.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes..." />
              </div>
            </div>
            <div className="career-modal-footer">
              <button className="career-btn-primary" onClick={save}><Check size={14} /> {editing ? 'Update' : 'Save'}</button>
              <button className="career-btn-ghost" onClick={closeForm}><X size={14} /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="career-empty">No companies yet — click "Add Company" to start.</div>
      ) : (
        <div className="career-list">
          {filtered.map(c => (
            <div key={c.id} className={`career-card ${expanded === c.id ? 'expanded' : ''}`}>
              <div className="career-card-main" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="career-card-left">
                  <span className="career-org-badge" style={{ background: `${TYPE_COLOR[c.type]}18`, color: TYPE_COLOR[c.type], borderColor: `${TYPE_COLOR[c.type]}40` }}>
                    {c.type}
                  </span>
                  <div>
                    <div className="career-exam-name">{c.name}</div>
                    <div className="career-category-tag">{c.experienceRequirements}</div>
                  </div>
                </div>
                <div className="career-card-right">
                  <button className="career-icon-btn" onClick={e => { e.stopPropagation(); openEdit(c); }}><Pencil size={14} /></button>
                  <button className="career-icon-btn career-icon-btn--red" onClick={e => { e.stopPropagation(); remove(c.id); }}><Trash2 size={14} /></button>
                </div>
              </div>

              {expanded === c.id && (
                <div className="career-card-detail">
                  {c.qualification && (
                    <div className="career-detail-row">
                      <span className="career-detail-label">Qualification</span>
                      <span className="career-detail-value">{c.qualification}</span>
                    </div>
                  )}
                  {c.eligibility && (
                    <div className="career-detail-row">
                      <span className="career-detail-label">Eligibility</span>
                      <span className="career-detail-value">{c.eligibility}</span>
                    </div>
                  )}
                  {c.requiredSkills && (
                    <div className="career-detail-row">
                      <span className="career-detail-label">Required Skills</span>
                      <div className="career-skills-list">
                        {c.requiredSkills.split(',').map(s => <span key={s} className="career-skill-chip">{s.trim()}</span>)}
                      </div>
                    </div>
                  )}
                  {c.interviewStages && (
                    <div className="career-detail-row">
                      <span className="career-detail-label">Interview Stages</span>
                      <div className="career-stages-list">
                        {c.interviewStages.split(',').map((s, i) => (
                          <div key={i} className="career-stage-item">
                            <span className="career-stage-num">{i + 1}</span>
                            <span>{s.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {c.notes && (
                    <div className="career-detail-row">
                      <span className="career-detail-label">Notes</span>
                      <span className="career-detail-value career-notes">{c.notes}</span>
                    </div>
                  )}
                  <div className="career-detail-links">
                    {c.careerPageLink && (
                      <a href={c.careerPageLink} target="_blank" rel="noreferrer" className="career-link-btn">
                        <ExternalLink size={13} /> Career Page
                      </a>
                    )}
                    {c.jobLinks && (
                      <a href={c.jobLinks} target="_blank" rel="noreferrer" className="career-link-btn career-link-btn--secondary">
                        <ExternalLink size={13} /> Job Links
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
