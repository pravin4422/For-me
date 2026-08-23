import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Quote, Image as ImageIcon, Target, LayoutGrid,
  Star, Plus, Trash2, Pencil, Check, X, RefreshCw, Eye
} from 'lucide-react';
import VisionBoard from '../../components/common/VisionBoard';
import './MotivationPage.css';

const C = {
  indigo: '#343090',
  violet: '#5f59f7',
  blue:   '#6592fd',
  sky:    '#44c2fd',
  purple: '#8c61ff',
};

// ── mock data ──────────────────────────────────────────────
const SAMPLE_QUOTES = [
  { id: 1, text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', tag: 'Career', favorite: true },
  { id: 2, text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', tag: 'Persistence', favorite: true },
  { id: 3, text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', tag: 'Mindset', favorite: false },
  { id: 4, text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', tag: 'Resilience', favorite: false },
  { id: 5, text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', tag: 'Dreams', favorite: false },
];

const SAMPLE_IMAGES = [
  { id: 'img1', src: 'https://picsum.photos/seed/mtn/400/300',    caption: 'Mountain Summit' },
  { id: 'img2', src: 'https://picsum.photos/seed/ocean/400/300',  caption: 'Ocean Horizon' },
  { id: 'img3', src: 'https://picsum.photos/seed/forest/400/300', caption: 'Forest Path' },
  { id: 'img4', src: 'https://picsum.photos/seed/city/400/300',   caption: 'City Lights' },
];

const SAMPLE_GOALS = [
  { id: 'g1', title: 'Complete AWS Certification', description: 'Pass the AWS Solutions Architect exam', targetDate: '2025-09-30', category: 'Career', status: 'In Progress', progress: 60 },
  { id: 'g2', title: 'Run a 5K', description: 'Train and complete a 5K run', targetDate: '2025-08-15', category: 'Health', status: 'In Progress', progress: 40 },
  { id: 'g3', title: 'Read 12 Books', description: 'Read one book per month this year', targetDate: '2025-12-31', category: 'Personal', status: 'In Progress', progress: 58 },
  { id: 'g4', title: 'Build Portfolio Website', description: 'Design and launch personal portfolio', targetDate: '2025-07-31', category: 'Career', status: 'Completed', progress: 100 },
  { id: 'g5', title: 'Save Emergency Fund', description: '3 months of expenses saved', targetDate: '2025-10-01', category: 'Study', status: 'Not Started', progress: 0 },
];

const DAILY_QUOTES = [
  { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'Great things never come from comfort zones.', author: 'Unknown' },
  { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  { text: 'Success doesn\'t just find you. You have to go out and get it.', author: 'Unknown' },
  { text: 'The harder you work for something, the greater you\'ll feel when you achieve it.', author: 'Unknown' },
];

const INIT_PINNED = [
  { ...SAMPLE_QUOTES[0], kind: 'quote' },
  { ...SAMPLE_IMAGES[0], kind: 'image' },
  { ...SAMPLE_GOALS[3], kind: 'goal' },
];

const TABS = [
  { key: 'quotes',  label: 'Quotes',       icon: <Quote size={15} /> },
  { key: 'images',  label: 'Images',        icon: <ImageIcon size={15} /> },
  { key: 'goals',   label: 'Goals',         icon: <Target size={15} /> },
  { key: 'board',   label: 'Vision Board',  icon: <LayoutGrid size={15} /> },
];

const STATUS_OPTS = ['Not Started', 'In Progress', 'Completed'];
const CAT_OPTS    = ['Study', 'Career', 'Health', 'Personal'];

// ── helpers ────────────────────────────────────────────────
function statusColor(s) {
  if (s === 'Completed')  return C.sky;
  if (s === 'In Progress') return C.violet;
  return C.blue;
}

function GoalProgressBar({ pct, status }) {
  return (
    <div className="mot-progress-wrap">
      <div className="mot-progress-track">
        <div className="mot-progress-fill" style={{ width: `${pct}%`, background: statusColor(status) }} />
      </div>
      <span className="mot-progress-pct" style={{ color: statusColor(status) }}>{pct}%</span>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────
const TAB_PATHS = {
  quotes: '/dashboard/motivation/quotes',
  images: '/dashboard/motivation/images',
  goals:  '/dashboard/motivation/goals',
  board:  '/dashboard/motivation/vision-board',
};

export default function MotivationPage({ tab: initialTab = 'quotes' }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);

  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const switchTab = (key) => { setTab(key); navigate(TAB_PATHS[key]); };
  const [dqIdx, setDqIdx] = useState(0);

  // quotes state
  const [quotes, setQuotes]       = useState(SAMPLE_QUOTES);
  const [qFilter, setQFilter]     = useState('all');
  const [editingQ, setEditingQ]   = useState(null);
  const [showQForm, setShowQForm] = useState(false);
  const [qDraft, setQDraft]       = useState({ text: '', author: '', tag: '' });

  // images state
  const [images, setImages]       = useState(SAMPLE_IMAGES);
  const [preview, setPreview]     = useState(null);
  const [imgCaption, setImgCaption] = useState('');

  // goals state
  const [goals, setGoals]         = useState(SAMPLE_GOALS);
  const [gCatFilter, setGCatFilter] = useState('all');
  const [gStatusFilter, setGStatusFilter] = useState('all');
  const [editingG, setEditingG]   = useState(null);
  const [showGForm, setShowGForm] = useState(false);
  const [gDraft, setGDraft]       = useState({ title: '', description: '', targetDate: '', category: 'Career', status: 'Not Started', progress: 0 });

  // vision board
  const [pinned, setPinned]       = useState(INIT_PINNED);

  // ── quote handlers ──
  const saveQuote = () => {
    if (!qDraft.text.trim()) return;
    if (editingQ) {
      setQuotes(p => p.map(q => q.id === editingQ ? { ...q, ...qDraft } : q));
      setEditingQ(null);
    } else {
      setQuotes(p => [{ id: Date.now(), ...qDraft, favorite: false }, ...p]);
    }
    setQDraft({ text: '', author: '', tag: '' });
    setShowQForm(false);
  };

  const startEditQ = (q) => {
    setQDraft({ text: q.text, author: q.author, tag: q.tag });
    setEditingQ(q.id);
    setShowQForm(true);
  };

  const toggleFav = (id) => setQuotes(p => p.map(q => q.id === id ? { ...q, favorite: !q.favorite } : q));

  // ── goal handlers ──
  const saveGoal = () => {
    if (!gDraft.title.trim()) return;
    if (editingG) {
      setGoals(p => p.map(g => g.id === editingG ? { ...g, ...gDraft } : g));
      setEditingG(null);
    } else {
      setGoals(p => [{ id: Date.now().toString(), ...gDraft }, ...p]);
    }
    setGDraft({ title: '', description: '', targetDate: '', category: 'Career', status: 'Not Started', progress: 0 });
    setShowGForm(false);
  };

  const startEditG = (g) => {
    setGDraft({ title: g.title, description: g.description, targetDate: g.targetDate, category: g.category, status: g.status, progress: g.progress });
    setEditingG(g.id);
    setShowGForm(true);
  };

  // ── image mock upload ──
  const addMockImage = () => {
    const seed = imgCaption.trim() || `img${Date.now()}`;
    setImages(p => [...p, { id: `img${Date.now()}`, src: `https://picsum.photos/seed/${seed}/400/300`, caption: imgCaption.trim() || 'Inspiration' }]);
    setImgCaption('');
  };

  // ── filtered data ──
  const filteredQuotes = qFilter === 'favorites'
    ? quotes.filter(q => q.favorite)
    : quotes;

  const filteredGoals = goals.filter(g =>
    (gCatFilter === 'all' || g.category === gCatFilter) &&
    (gStatusFilter === 'all' || g.status === gStatusFilter)
  );

  const dq = DAILY_QUOTES[dqIdx];

  return (
    <div className="mot-page">
      {/* ── hero banner ── */}
      <div className="mot-hero">
        <div className="mot-hero-content">
          <span className="mot-hero-label">Quote of the Day</span>
          <blockquote className="mot-hero-quote">"{dq.text}"</blockquote>
          <span className="mot-hero-author">— {dq.author}</span>
        </div>
        <button className="mot-refresh-btn" onClick={() => setDqIdx(i => (i + 1) % DAILY_QUOTES.length)}>
          <RefreshCw size={14} /> New Quote
        </button>
      </div>

      {/* ── tabs ── */}
      <div className="mot-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`mot-tab ${tab === t.key ? 'active' : ''}`} onClick={() => switchTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── tab content ── */}
      <div className="mot-content">

        {/* QUOTES */}
        {tab === 'quotes' && (
          <div className="mot-section">
            <div className="mot-section-header">
              <Quote size={16} color={C.violet} />
              <h3>Quotes</h3>
              <div className="mot-filter-group">
                <button className={`mot-filter-btn ${qFilter === 'all' ? 'active' : ''}`} onClick={() => setQFilter('all')}>All</button>
                <button className={`mot-filter-btn ${qFilter === 'favorites' ? 'active' : ''}`} onClick={() => setQFilter('favorites')}>
                  <Star size={12} /> Favorites
                </button>
              </div>
              <button className="mot-add-btn" onClick={() => { setShowQForm(s => !s); setEditingQ(null); setQDraft({ text: '', author: '', tag: '' }); }}>
                <Plus size={14} /> Add Quote
              </button>
            </div>

            {showQForm && (
              <div className="mot-form">
                <textarea className="mot-input mot-textarea" placeholder="Quote text *" value={qDraft.text} onChange={e => setQDraft(p => ({ ...p, text: e.target.value }))} />
                <div className="mot-form-row">
                  <input className="mot-input" placeholder="Author" value={qDraft.author} onChange={e => setQDraft(p => ({ ...p, author: e.target.value }))} />
                  <input className="mot-input" placeholder="Tag / Category" value={qDraft.tag} onChange={e => setQDraft(p => ({ ...p, tag: e.target.value }))} />
                </div>
                <div className="mot-form-actions">
                  <button className="mot-btn-primary" onClick={saveQuote}><Check size={13} /> {editingQ ? 'Update' : 'Save'}</button>
                  <button className="mot-btn-ghost" onClick={() => { setShowQForm(false); setEditingQ(null); }}><X size={13} /> Cancel</button>
                </div>
              </div>
            )}

            {filteredQuotes.length === 0 ? (
              <div className="mot-empty">No quotes yet — add your first one.</div>
            ) : (
              <div className="mot-quotes-grid">
                {filteredQuotes.map(q => (
                  <div key={q.id} className={`mot-quote-card ${q.favorite ? 'mot-quote-card--fav' : ''}`}>
                    <button className={`mot-star-btn ${q.favorite ? 'active' : ''}`} onClick={() => toggleFav(q.id)}>
                      <Star size={14} fill={q.favorite ? C.purple : 'none'} color={q.favorite ? C.purple : 'currentColor'} />
                    </button>
                    <p className="mot-quote-text">"{q.text}"</p>
                    <div className="mot-quote-meta">
                      {q.author && <span className="mot-quote-author">— {q.author}</span>}
                      {q.tag && <span className="mot-tag">{q.tag}</span>}
                    </div>
                    <div className="mot-card-actions">
                      <button className="mot-icon-btn" onClick={() => startEditQ(q)}><Pencil size={13} /></button>
                      <button className="mot-icon-btn red" onClick={() => setQuotes(p => p.filter(x => x.id !== q.id))}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* IMAGES */}
        {tab === 'images' && (
          <div className="mot-section">
            <div className="mot-section-header">
              <ImageIcon size={16} color={C.blue} />
              <h3>Images</h3>
              <div className="mot-img-upload">
                <input className="mot-input mot-input--sm" placeholder="Caption (optional)" value={imgCaption} onChange={e => setImgCaption(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMockImage()} />
                <button className="mot-add-btn" onClick={addMockImage}><Plus size={14} /> Add Image</button>
              </div>
            </div>

            {images.length === 0 ? (
              <div className="mot-empty">No images yet — add your first one.</div>
            ) : (
              <div className="mot-img-grid">
                {images.map(img => (
                  <div key={img.id} className="mot-img-card">
                    <img src={img.src} alt={img.caption} className="mot-img-thumb" onClick={() => setPreview(img)} />
                    <div className="mot-img-footer">
                      <span className="mot-img-caption">{img.caption}</span>
                      <div className="mot-img-actions">
                        <button className="mot-icon-btn" onClick={() => setPreview(img)}><Eye size={13} /></button>
                        <button className="mot-icon-btn red" onClick={() => setImages(p => p.filter(x => x.id !== img.id))}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GOALS */}
        {tab === 'goals' && (
          <div className="mot-section">
            <div className="mot-section-header">
              <Target size={16} color={C.sky} />
              <h3>Goals</h3>
              <div className="mot-filter-group">
                <select className="mot-select" value={gCatFilter} onChange={e => setGCatFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  {CAT_OPTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="mot-select" value={gStatusFilter} onChange={e => setGStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button className="mot-add-btn" onClick={() => { setShowGForm(s => !s); setEditingG(null); setGDraft({ title: '', description: '', targetDate: '', category: 'Career', status: 'Not Started', progress: 0 }); }}>
                <Plus size={14} /> Add Goal
              </button>
            </div>

            {showGForm && (
              <div className="mot-form">
                <div className="mot-form-row">
                  <input className="mot-input" placeholder="Goal title *" value={gDraft.title} onChange={e => setGDraft(p => ({ ...p, title: e.target.value }))} />
                  <input className="mot-input" type="date" value={gDraft.targetDate} onChange={e => setGDraft(p => ({ ...p, targetDate: e.target.value }))} />
                </div>
                <textarea className="mot-input mot-textarea" placeholder="Description" value={gDraft.description} onChange={e => setGDraft(p => ({ ...p, description: e.target.value }))} />
                <div className="mot-form-row">
                  <select className="mot-input" value={gDraft.category} onChange={e => setGDraft(p => ({ ...p, category: e.target.value }))}>
                    {CAT_OPTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="mot-input" value={gDraft.status} onChange={e => setGDraft(p => ({ ...p, status: e.target.value }))}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="mot-progress-input-wrap">
                    <label className="mot-progress-input-label">Progress {gDraft.progress}%</label>
                    <input type="range" min="0" max="100" value={gDraft.progress} onChange={e => setGDraft(p => ({ ...p, progress: parseInt(e.target.value) }))} className="mot-range" />
                  </div>
                </div>
                <div className="mot-form-actions">
                  <button className="mot-btn-primary" onClick={saveGoal}><Check size={13} /> {editingG ? 'Update' : 'Save'}</button>
                  <button className="mot-btn-ghost" onClick={() => { setShowGForm(false); setEditingG(null); }}><X size={13} /> Cancel</button>
                </div>
              </div>
            )}

            {filteredGoals.length === 0 ? (
              <div className="mot-empty">No goals match the current filter.</div>
            ) : (
              <div className="mot-goals-list">
                {filteredGoals.map(g => (
                  <div key={g.id} className="mot-goal-card">
                    <div className="mot-goal-top">
                      <div className="mot-goal-info">
                        <span className="mot-tag" style={{ background: `${C.blue}18`, color: C.blue }}>{g.category}</span>
                        <h4 className="mot-goal-title">{g.title}</h4>
                        {g.description && <p className="mot-goal-desc">{g.description}</p>}
                      </div>
                      <div className="mot-goal-right">
                        <span className="mot-status-badge" style={{ background: `${statusColor(g.status)}18`, color: statusColor(g.status) }}>{g.status}</span>
                        {g.targetDate && <span className="mot-goal-date">{new Date(g.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      </div>
                    </div>
                    <GoalProgressBar pct={g.progress} status={g.status} />
                    <div className="mot-card-actions">
                      <button className="mot-icon-btn" onClick={() => startEditG(g)}><Pencil size={13} /></button>
                      <button className="mot-icon-btn red" onClick={() => setGoals(p => p.filter(x => x.id !== g.id))}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISION BOARD */}
        {tab === 'board' && (
          <div className="mot-section">
            <div className="mot-section-header">
              <LayoutGrid size={16} color={C.purple} />
              <h3>Vision Board</h3>
            </div>
            <VisionBoard
              quotes={quotes.map(q => ({ ...q, kind: 'quote' }))}
              images={images.map(i => ({ ...i, kind: 'image' }))}
              goals={goals.map(g => ({ ...g, kind: 'goal' }))}
              pinned={pinned}
              onPinnedChange={setPinned}
            />
          </div>
        )}
      </div>

      {/* image preview modal */}
      {preview && (
        <div className="mot-modal-overlay" onClick={() => setPreview(null)}>
          <div className="mot-modal" onClick={e => e.stopPropagation()}>
            <button className="mot-modal-close" onClick={() => setPreview(null)}><X size={18} /></button>
            <img src={preview.src} alt={preview.caption} className="mot-modal-img" />
            {preview.caption && <p className="mot-modal-caption">{preview.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
