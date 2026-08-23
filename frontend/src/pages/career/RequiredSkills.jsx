import { useState } from 'react';
import { Code, Plus, Trash2, X, Check, ExternalLink, ChevronDown } from 'lucide-react';
import './CareerPage.css';

const DOMAIN_SKILLS = {
  'Full Stack Web': [
    { id: 1, name: 'HTML & CSS', status: 'Learned', resource: 'https://developer.mozilla.org' },
    { id: 2, name: 'JavaScript (ES6+)', status: 'Learned', resource: 'https://javascript.info' },
    { id: 3, name: 'React.js', status: 'In Progress', resource: 'https://react.dev' },
    { id: 4, name: 'Node.js & Express', status: 'In Progress', resource: 'https://nodejs.org' },
    { id: 5, name: 'SQL / PostgreSQL', status: 'Not Started', resource: 'https://www.postgresql.org/docs' },
    { id: 6, name: 'REST API Design', status: 'Not Started', resource: '' },
    { id: 7, name: 'Git & GitHub', status: 'Learned', resource: 'https://git-scm.com/doc' },
  ],
  'Data Science': [
    { id: 1, name: 'Python', status: 'In Progress', resource: 'https://docs.python.org' },
    { id: 2, name: 'NumPy & Pandas', status: 'Not Started', resource: 'https://pandas.pydata.org' },
    { id: 3, name: 'Machine Learning (Scikit-learn)', status: 'Not Started', resource: 'https://scikit-learn.org' },
    { id: 4, name: 'Data Visualisation', status: 'Not Started', resource: '' },
    { id: 5, name: 'SQL', status: 'In Progress', resource: '' },
    { id: 6, name: 'Statistics & Probability', status: 'Not Started', resource: '' },
  ],
  'Government Exam': [
    { id: 1, name: 'Quantitative Aptitude', status: 'In Progress', resource: 'https://www.indiabix.com' },
    { id: 2, name: 'Reasoning Ability', status: 'In Progress', resource: 'https://www.indiabix.com' },
    { id: 3, name: 'English Language', status: 'Not Started', resource: '' },
    { id: 4, name: 'General Awareness', status: 'Not Started', resource: '' },
    { id: 5, name: 'Computer Knowledge', status: 'Learned', resource: '' },
    { id: 6, name: 'Current Affairs', status: 'Not Started', resource: '' },
  ],
  'DevOps / Cloud': [
    { id: 1, name: 'Linux Basics', status: 'In Progress', resource: 'https://linuxcommand.org' },
    { id: 2, name: 'Docker', status: 'Not Started', resource: 'https://docs.docker.com' },
    { id: 3, name: 'Kubernetes', status: 'Not Started', resource: 'https://kubernetes.io/docs' },
    { id: 4, name: 'AWS / Azure / GCP', status: 'Not Started', resource: 'https://aws.amazon.com/training' },
    { id: 5, name: 'CI/CD Pipelines', status: 'Not Started', resource: '' },
    { id: 6, name: 'Terraform', status: 'Not Started', resource: 'https://developer.hashicorp.com/terraform' },
  ],
};

const DOMAINS  = Object.keys(DOMAIN_SKILLS);
const STATUSES = ['Not Started', 'In Progress', 'Learned'];

const STATUS_COLOR = {
  'Not Started': { bg: '#f1f5f9', color: '#64748b' },
  'In Progress': { bg: '#fef3c7', color: '#d97706' },
  'Learned':     { bg: '#d1fae5', color: '#059669' },
};

function ProgressBar({ skills }) {
  const total   = skills.length;
  const learned = skills.filter(s => s.status === 'Learned').length;
  const inprog  = skills.filter(s => s.status === 'In Progress').length;
  const pct     = total ? Math.round((learned / total) * 100) : 0;
  return (
    <div className="career-skill-progress">
      <div className="career-skill-progress-bar">
        <div className="career-skill-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="career-skill-progress-text">{learned}/{total} learned · {inprog} in progress</span>
    </div>
  );
}

export default function RequiredSkills() {
  const [domain, setDomain]       = useState(DOMAINS[0]);
  const [skillsMap, setSkillsMap] = useState(DOMAIN_SKILLS);
  const [showAdd, setShowAdd]     = useState(false);
  const [draft, setDraft]         = useState({ name: '', status: 'Not Started', resource: '' });
  const [domainOpen, setDomainOpen] = useState(false);

  const skills = skillsMap[domain] || [];

  const updateStatus = (id, status) => {
    setSkillsMap(p => ({
      ...p,
      [domain]: p[domain].map(s => s.id === id ? { ...s, status } : s),
    }));
  };

  const addSkill = () => {
    if (!draft.name.trim()) return;
    setSkillsMap(p => ({
      ...p,
      [domain]: [...(p[domain] || []), { id: Date.now(), ...draft }],
    }));
    setDraft({ name: '', status: 'Not Started', resource: '' });
    setShowAdd(false);
  };

  const removeSkill = (id) => {
    setSkillsMap(p => ({ ...p, [domain]: p[domain].filter(s => s.id !== id) }));
  };

  return (
    <div className="career-page">
      <div className="career-page-header">
        <div className="career-page-title">
          <Code size={22} />
          <h2>Required Skills</h2>
        </div>
        <button className="career-add-btn" onClick={() => setShowAdd(s => !s)}>
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {/* domain selector */}
      <div className="career-domain-selector">
        <span className="career-domain-label">Domain / Focus Area:</span>
        <div className="career-domain-dropdown-wrap">
          <button className="career-domain-btn" onClick={() => setDomainOpen(o => !o)}>
            {domain} <ChevronDown size={14} />
          </button>
          {domainOpen && (
            <div className="career-domain-dropdown">
              {DOMAINS.map(d => (
                <button
                  key={d}
                  className={`career-domain-option ${domain === d ? 'active' : ''}`}
                  onClick={() => { setDomain(d); setDomainOpen(false); }}
                >{d}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProgressBar skills={skills} />

      {/* add form */}
      {showAdd && (
        <div className="career-inline-form">
          <input
            className="career-input"
            placeholder="Skill name *"
            value={draft.name}
            onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
          />
          <select
            className="career-input"
            value={draft.status}
            onChange={e => setDraft(p => ({ ...p, status: e.target.value }))}
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <input
            className="career-input"
            placeholder="Resource link (optional)"
            value={draft.resource}
            onChange={e => setDraft(p => ({ ...p, resource: e.target.value }))}
          />
          <button className="career-btn-primary" onClick={addSkill}><Check size={13} /> Add</button>
          <button className="career-btn-ghost" onClick={() => setShowAdd(false)}><X size={13} /></button>
        </div>
      )}

      {/* skills list */}
      <div className="career-skills-tracker">
        {skills.length === 0 ? (
          <div className="career-empty">No skills for this domain yet.</div>
        ) : (
          skills.map(s => (
            <div key={s.id} className="career-skill-row">
              <div className="career-skill-name">{s.name}</div>
              <div className="career-skill-controls">
                <div className="career-status-toggle">
                  {STATUSES.map(st => (
                    <button
                      key={st}
                      className={`career-status-btn ${s.status === st ? 'active' : ''}`}
                      style={s.status === st ? { background: STATUS_COLOR[st].bg, color: STATUS_COLOR[st].color, borderColor: STATUS_COLOR[st].color } : {}}
                      onClick={() => updateStatus(s.id, st)}
                    >{st}</button>
                  ))}
                </div>
                {s.resource && (
                  <a href={s.resource} target="_blank" rel="noreferrer" className="career-skill-link">
                    <ExternalLink size={13} />
                  </a>
                )}
                <button className="career-icon-btn career-icon-btn--red" onClick={() => removeSkill(s.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
