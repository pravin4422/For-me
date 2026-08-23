import { useState } from 'react';
import { Building, ExternalLink, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import './CareerPage.css';

const GOVT_DATA = [
  {
    id: 1, org: 'RRB', exam: 'RRB NTPC', category: 'Railway',
    qualification: 'Graduate (Any Stream)', eligibility: 'Age 18–33 yrs, Indian Citizen',
    notificationLink: 'https://indianrailways.gov.in', careerLink: 'https://rrbapply.gov.in',
    status: 'Active',
  },
  {
    id: 2, org: 'RRB', exam: 'RRB Group D', category: 'Railway',
    qualification: '10th Pass + ITI', eligibility: 'Age 18–33 yrs, Indian Citizen',
    notificationLink: 'https://indianrailways.gov.in', careerLink: 'https://rrbapply.gov.in',
    status: 'Upcoming',
  },
  {
    id: 3, org: 'SSC', exam: 'SSC CGL', category: 'Central Govt',
    qualification: 'Graduate (Any Stream)', eligibility: 'Age 18–32 yrs, Indian Citizen',
    notificationLink: 'https://ssc.nic.in', careerLink: 'https://ssc.nic.in',
    status: 'Active',
  },
  {
    id: 4, org: 'SSC', exam: 'SSC CHSL', category: 'Central Govt',
    qualification: '12th Pass', eligibility: 'Age 18–27 yrs, Indian Citizen',
    notificationLink: 'https://ssc.nic.in', careerLink: 'https://ssc.nic.in',
    status: 'Active',
  },
  {
    id: 5, org: 'IBPS', exam: 'IBPS PO', category: 'Banking',
    qualification: 'Graduate (Any Stream)', eligibility: 'Age 20–30 yrs, Indian Citizen',
    notificationLink: 'https://ibps.in', careerLink: 'https://ibps.in',
    status: 'Upcoming',
  },
  {
    id: 6, org: 'SBI', exam: 'SBI PO', category: 'Banking',
    qualification: 'Graduate (Any Stream)', eligibility: 'Age 21–30 yrs, Indian Citizen',
    notificationLink: 'https://sbi.co.in/careers', careerLink: 'https://sbi.co.in/careers',
    status: 'Active',
  },
  {
    id: 7, org: 'TNPSC', exam: 'TNPSC Group 2', category: 'State Govt',
    qualification: 'Graduate (Any Stream)', eligibility: 'Age 18–32 yrs, Tamil Nadu Resident',
    notificationLink: 'https://tnpsc.gov.in', careerLink: 'https://tnpscexams.in',
    status: 'Active',
  },
  {
    id: 8, org: 'TNPSC', exam: 'TNPSC Group 4', category: 'State Govt',
    qualification: '12th Pass', eligibility: 'Age 18–30 yrs, Tamil Nadu Resident',
    notificationLink: 'https://tnpsc.gov.in', careerLink: 'https://tnpscexams.in',
    status: 'Upcoming',
  },
  {
    id: 9, org: 'UPSC', exam: 'Civil Services (IAS)', category: 'Central Govt',
    qualification: 'Graduate (Any Stream)', eligibility: 'Age 21–32 yrs, Indian Citizen',
    notificationLink: 'https://upsc.gov.in', careerLink: 'https://upsc.gov.in',
    status: 'Active',
  },
  {
    id: 10, org: 'DRDO', exam: 'DRDO CEPTAM', category: 'Defence',
    qualification: 'B.E / B.Tech / Diploma', eligibility: 'Age 18–28 yrs, Indian Citizen',
    notificationLink: 'https://drdo.gov.in', careerLink: 'https://drdo.gov.in/careers',
    status: 'Upcoming',
  },
];

const CATEGORIES = ['All', 'Railway', 'Banking', 'Central Govt', 'State Govt', 'Defence'];
const STATUSES   = ['All', 'Active', 'Upcoming'];

const STATUS_COLOR = { Active: '#10b981', Upcoming: '#f59e0b' };

export default function GovtOpportunities() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus]     = useState('All');
  const [sortBy, setSortBy]     = useState('org');
  const [sortDir, setSortDir]   = useState('asc');
  const [expanded, setExpanded] = useState(null);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const filtered = GOVT_DATA
    .filter(d =>
      (category === 'All' || d.category === category) &&
      (status   === 'All' || d.status   === status) &&
      (search === '' || d.exam.toLowerCase().includes(search.toLowerCase()) || d.org.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = a[sortBy] || '', vb = b[sortBy] || '';
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const SortIcon = ({ field }) => sortBy === field
    ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : null;

  return (
    <div className="career-page">
      <div className="career-page-header">
        <div className="career-page-title">
          <Building size={22} />
          <h2>Government Opportunities</h2>
        </div>
        <span className="career-count-badge">{filtered.length} exams</span>
      </div>

      {/* filters */}
      <div className="career-filters">
        <div className="career-search-wrap">
          <Search size={14} />
          <input
            className="career-search"
            placeholder="Search exam or organisation..."
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
        <div className="career-filter-group">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`career-filter-btn ${status === s ? 'active' : ''}`}
              onClick={() => setStatus(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* sort bar */}
      <div className="career-sort-bar">
        <span className="career-sort-label">Sort by:</span>
        {['org', 'exam', 'category', 'status'].map(f => (
          <button key={f} className={`career-sort-btn ${sortBy === f ? 'active' : ''}`} onClick={() => toggleSort(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} <SortIcon field={f} />
          </button>
        ))}
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="career-empty">No results match your filters.</div>
      ) : (
        <div className="career-list">
          {filtered.map(d => (
            <div key={d.id} className={`career-card ${expanded === d.id ? 'expanded' : ''}`}>
              <div className="career-card-main" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                <div className="career-card-left">
                  <span className="career-org-badge">{d.org}</span>
                  <div>
                    <div className="career-exam-name">{d.exam}</div>
                    <div className="career-category-tag">{d.category}</div>
                  </div>
                </div>
                <div className="career-card-right">
                  <span className="career-status-dot" style={{ background: STATUS_COLOR[d.status] }} />
                  <span className="career-status-text" style={{ color: STATUS_COLOR[d.status] }}>{d.status}</span>
                  {expanded === d.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
              </div>

              {expanded === d.id && (
                <div className="career-card-detail">
                  <div className="career-detail-row">
                    <span className="career-detail-label">Qualification</span>
                    <span className="career-detail-value">{d.qualification}</span>
                  </div>
                  <div className="career-detail-row">
                    <span className="career-detail-label">Eligibility</span>
                    <span className="career-detail-value">{d.eligibility}</span>
                  </div>
                  <div className="career-detail-links">
                    <a href={d.notificationLink} target="_blank" rel="noreferrer" className="career-link-btn">
                      <ExternalLink size={13} /> Official Notification
                    </a>
                    <a href={d.careerLink} target="_blank" rel="noreferrer" className="career-link-btn career-link-btn--secondary">
                      <ExternalLink size={13} /> Career Page
                    </a>
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
