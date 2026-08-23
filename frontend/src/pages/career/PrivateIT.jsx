import { useState } from 'react';
import { Monitor, ExternalLink, Search, Filter, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import './CareerPage.css';

const IT_DATA = [
  {
    id: 1, name: 'Google', type: 'Product',
    skills: ['DSA', 'System Design', 'Python/Java', 'ML Basics'],
    stages: ['Online Assessment', 'Phone Screen', 'Technical (x4)', 'Hiring Committee'],
    experience: '0–2 yrs (New Grad) / 3+ yrs (Experienced)',
    careerLink: 'https://careers.google.com',
    jobLinks: ['https://careers.google.com/jobs'],
    notes: 'Highly competitive. Focus on LeetCode Hard + System Design.',
  },
  {
    id: 2, name: 'Microsoft', type: 'Product',
    skills: ['DSA', 'System Design', 'C#/Java/Python', 'Azure Basics'],
    stages: ['Online Assessment', 'Technical Screen', 'Virtual Onsite (x4)'],
    experience: '0–2 yrs (New Grad) / 3+ yrs (Experienced)',
    careerLink: 'https://careers.microsoft.com',
    jobLinks: ['https://careers.microsoft.com/jobs'],
    notes: 'Behavioral rounds important. STAR method recommended.',
  },
  {
    id: 3, name: 'TCS', type: 'Service',
    skills: ['Java', 'SQL', 'Communication', 'Aptitude'],
    stages: ['TCS NQT', 'Technical Interview', 'HR Interview'],
    experience: 'Fresher / 1–3 yrs',
    careerLink: 'https://www.tcs.com/careers',
    jobLinks: ['https://nextstep.tcs.com'],
    notes: 'NQT score is key. Good for freshers.',
  },
  {
    id: 4, name: 'Infosys', type: 'Service',
    skills: ['Java', 'Python', 'SQL', 'Communication'],
    stages: ['InfyTQ / Online Test', 'Technical Interview', 'HR Interview'],
    experience: 'Fresher / 1–3 yrs',
    careerLink: 'https://www.infosys.com/careers',
    jobLinks: ['https://career.infosys.com'],
    notes: 'InfyTQ certification helps. Strong communication required.',
  },
  {
    id: 5, name: 'Wipro', type: 'Service',
    skills: ['Java', 'Python', 'SQL', 'Aptitude'],
    stages: ['NLTH Test', 'Technical Interview', 'HR Interview'],
    experience: 'Fresher / 1–3 yrs',
    careerLink: 'https://careers.wipro.com',
    jobLinks: ['https://careers.wipro.com/careers-home'],
    notes: 'NLTH is the entry test. Moderate difficulty.',
  },
  {
    id: 6, name: 'Zoho', type: 'Product',
    skills: ['C/C++/Java', 'DSA', 'Problem Solving', 'SQL'],
    stages: ['Written Test', 'Programming Round', 'Technical Interview (x2)', 'HR'],
    experience: 'Fresher / 1–5 yrs',
    careerLink: 'https://careers.zohocorp.com',
    jobLinks: ['https://careers.zohocorp.com/jobs'],
    notes: 'Strong coding skills required. No degree bias.',
  },
  {
    id: 7, name: 'Freshworks', type: 'Product',
    skills: ['React/Node', 'DSA', 'System Design', 'SQL'],
    stages: ['Online Coding Test', 'Technical (x2)', 'System Design', 'HR'],
    experience: '1–5 yrs',
    careerLink: 'https://careers.freshworks.com',
    jobLinks: ['https://careers.freshworks.com/jobs'],
    notes: 'Good work culture. Focus on full-stack skills.',
  },
  {
    id: 8, name: 'Razorpay', type: 'Startup',
    skills: ['Backend (Go/Java)', 'System Design', 'DSA', 'Payments Domain'],
    stages: ['Resume Screen', 'Technical (x2)', 'System Design', 'Culture Fit', 'HR'],
    experience: '2–6 yrs',
    careerLink: 'https://razorpay.com/jobs',
    jobLinks: ['https://razorpay.com/jobs'],
    notes: 'Fast-paced fintech. Domain knowledge is a plus.',
  },
  {
    id: 9, name: 'CRED', type: 'Startup',
    skills: ['Android/iOS/Backend', 'DSA', 'System Design'],
    stages: ['Online Assessment', 'Technical (x3)', 'Bar Raiser', 'HR'],
    experience: '2–7 yrs',
    careerLink: 'https://careers.cred.club',
    jobLinks: ['https://careers.cred.club'],
    notes: 'High bar. Strong problem-solving expected.',
  },
  {
    id: 10, name: 'Accenture', type: 'Service',
    skills: ['Java', 'Python', 'Cloud Basics', 'Communication'],
    stages: ['Cognitive & Technical Assessment', 'Technical Interview', 'HR Interview'],
    experience: 'Fresher / 1–4 yrs',
    careerLink: 'https://www.accenture.com/in-en/careers',
    jobLinks: ['https://www.accenture.com/in-en/careers/jobsearch'],
    notes: 'Large intake. Good for freshers and lateral hires.',
  },
];

const TYPES = ['All', 'Product', 'Service', 'Startup'];

export default function PrivateIT() {
  const [search, setSearch]   = useState('');
  const [type, setType]       = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = IT_DATA.filter(d =>
    (type === 'All' || d.type === type) &&
    (search === '' || d.name.toLowerCase().includes(search.toLowerCase()))
  );

  const TYPE_COLOR = { Product: '#6366f1', Service: '#0ea5e9', Startup: '#f59e0b' };

  return (
    <div className="career-page">
      <div className="career-page-header">
        <div className="career-page-title">
          <Monitor size={22} />
          <h2>Private IT Companies</h2>
        </div>
        <span className="career-count-badge">{filtered.length} companies</span>
      </div>

      <div className="career-filters">
        <div className="career-search-wrap">
          <Search size={14} />
          <input
            className="career-search"
            placeholder="Search company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="career-filter-group">
          <Filter size={14} />
          {TYPES.map(t => (
            <button
              key={t}
              className={`career-filter-btn ${type === t ? 'active' : ''}`}
              onClick={() => setType(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="career-empty">No companies match your search.</div>
      ) : (
        <div className="career-list">
          {filtered.map(d => (
            <div key={d.id} className={`career-card ${expanded === d.id ? 'expanded' : ''}`}>
              <div className="career-card-main" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                <div className="career-card-left">
                  <span className="career-org-badge" style={{ background: `${TYPE_COLOR[d.type]}18`, color: TYPE_COLOR[d.type], borderColor: `${TYPE_COLOR[d.type]}40` }}>
                    {d.type}
                  </span>
                  <div>
                    <div className="career-exam-name">{d.name}</div>
                    <div className="career-skills-preview">
                      {d.skills.slice(0, 3).map(s => <span key={s} className="career-skill-chip">{s}</span>)}
                      {d.skills.length > 3 && <span className="career-skill-chip career-skill-chip--more">+{d.skills.length - 3}</span>}
                    </div>
                  </div>
                </div>
                <div className="career-card-right">
                  <span className="career-exp-tag"><Briefcase size={12} /> {d.experience.split('/')[0].trim()}</span>
                  {expanded === d.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
              </div>

              {expanded === d.id && (
                <div className="career-card-detail">
                  <div className="career-detail-row">
                    <span className="career-detail-label">Required Skills</span>
                    <div className="career-skills-list">
                      {d.skills.map(s => <span key={s} className="career-skill-chip">{s}</span>)}
                    </div>
                  </div>
                  <div className="career-detail-row">
                    <span className="career-detail-label">Interview Stages</span>
                    <div className="career-stages-list">
                      {d.stages.map((s, i) => (
                        <div key={i} className="career-stage-item">
                          <span className="career-stage-num">{i + 1}</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="career-detail-row">
                    <span className="career-detail-label">Experience</span>
                    <span className="career-detail-value">{d.experience}</span>
                  </div>
                  {d.notes && (
                    <div className="career-detail-row">
                      <span className="career-detail-label">Notes</span>
                      <span className="career-detail-value career-notes">{d.notes}</span>
                    </div>
                  )}
                  <div className="career-detail-links">
                    <a href={d.careerLink} target="_blank" rel="noreferrer" className="career-link-btn">
                      <ExternalLink size={13} /> Career Page
                    </a>
                    {d.jobLinks.map((l, i) => (
                      <a key={i} href={l} target="_blank" rel="noreferrer" className="career-link-btn career-link-btn--secondary">
                        <ExternalLink size={13} /> Job Listings
                      </a>
                    ))}
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
