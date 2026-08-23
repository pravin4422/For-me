import { useState } from 'react';
import { Star, Trash2, ExternalLink, Bookmark, Search, Info } from 'lucide-react';
import './CareerPage.css';

const INIT_WATCHLIST = [
  {
    id: 1, name: 'TCS', type: 'Service', action: 'Apply by Aug 10',
    careerLink: 'https://nextstep.tcs.com', note: 'NQT score required',
  },
  {
    id: 2, name: 'Zoho', type: 'Product', action: 'Interview Aug 20',
    careerLink: 'https://careers.zohocorp.com', note: 'Programming round is key',
  },
  {
    id: 3, name: 'DRDO', type: 'Government', action: 'Notification out',
    careerLink: 'https://drdo.gov.in/careers', note: 'Check eligibility criteria',
  },
];

const TYPE_COLOR = { Product: '#6366f1', Service: '#0ea5e9', Startup: '#f59e0b', Government: '#10b981' };

export default function CompanyWatchlist() {
  const [watchlist, setWatchlist] = useState(INIT_WATCHLIST);
  const [search, setSearch]       = useState('');

  const remove = (id) => setWatchlist(p => p.filter(c => c.id !== id));

  const filtered = watchlist.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="career-page">
      <div className="career-page-header">
        <div className="career-page-title">
          <Bookmark size={22} />
          <h2>Company Watchlist</h2>
        </div>
        <span className="career-count-badge">{watchlist.length} starred</span>
      </div>

      {/* dashboard sync info */}
      <div className="career-info-banner">
        <Info size={14} />
        <span>Watchlisted companies automatically appear on your main Dashboard for quick access.</span>
      </div>

      <div className="career-filters">
        <div className="career-search-wrap">
          <Search size={14} />
          <input
            className="career-search"
            placeholder="Search watchlist..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="career-empty">
          <Star size={32} />
          <p>No companies in your watchlist yet.</p>
          <p className="career-empty-sub">Star companies from Government Opportunities or Private IT Companies to track them here.</p>
        </div>
      ) : (
        <div className="career-watchlist-grid">
          {filtered.map(c => (
            <div key={c.id} className="career-watchlist-card">
              <div className="career-watchlist-top">
                <div className="career-watchlist-star">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                </div>
                <div className="career-watchlist-info">
                  <div className="career-watchlist-name">{c.name}</div>
                  <span
                    className="career-org-badge"
                    style={{ background: `${TYPE_COLOR[c.type]}18`, color: TYPE_COLOR[c.type], borderColor: `${TYPE_COLOR[c.type]}40` }}
                  >
                    {c.type}
                  </span>
                </div>
                <button className="career-icon-btn career-icon-btn--red" onClick={() => remove(c.id)}>
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="career-watchlist-action">{c.action}</div>

              {c.note && <div className="career-watchlist-note">{c.note}</div>}

              <div className="career-watchlist-footer">
                <a href={c.careerLink} target="_blank" rel="noreferrer" className="career-link-btn career-link-btn--sm">
                  <ExternalLink size={12} /> Career Page
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
