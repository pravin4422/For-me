import { useState } from 'react';
import { FlaskConical, Search, Plus, Star, Pencil, Trash2, X } from 'lucide-react';
import './aptitude.css';

const TOPICS = ['Percentage', 'Profit & Loss', 'Time & Work', 'Ratio', 'Speed & Distance', 'Algebra', 'Geometry', 'Probability'];

const SEED = [
  { id: 1, topic: 'Percentage', name: 'Percentage Formula', expr: 'P% = (Part / Whole) × 100', explanation: 'Converts a part-to-whole relationship into a percentage.', example: '45 out of 180 = (45/180)×100 = 25%', userAdded: false, starred: false },
  { id: 2, topic: 'Percentage', name: 'Successive % Change', expr: 'Net% = a + b + (ab/100)', explanation: 'Two successive percentage changes a% and b%.', example: '+20% then −20% = 20−20−4 = −4%', userAdded: false, starred: false },
  { id: 3, topic: 'Profit & Loss', name: 'Profit Percentage', expr: 'P% = [(SP − CP) / CP] × 100', explanation: 'Profit is always calculated on Cost Price.', example: 'CP=80, SP=100 → P%=25%', userAdded: false, starred: false },
  { id: 4, topic: 'Profit & Loss', name: 'Selling Price', expr: 'SP = CP × (100 + P%) / 100', explanation: 'Find SP when CP and profit% are known.', example: 'CP=200, P%=15 → SP=230', userAdded: false, starred: false },
  { id: 5, topic: 'Time & Work', name: 'Combined Work Rate', expr: '1/T = 1/A + 1/B', explanation: 'A and B working together complete work in T days.', example: 'A=6d, B=4d → T=12/5=2.4d', userAdded: false, starred: false },
  { id: 6, topic: 'Speed & Distance', name: 'Speed Formula', expr: 'S = D / T', explanation: 'Fundamental speed-distance-time relationship.', example: 'D=120km, T=2h → S=60km/h', userAdded: false, starred: false },
  { id: 7, topic: 'Speed & Distance', name: 'Average Speed', expr: 'Avg S = 2ab / (a + b)', explanation: 'When equal distances are covered at speeds a and b.', example: 'a=60, b=40 → Avg=48 km/h', userAdded: false, starred: false },
  { id: 8, topic: 'Algebra', name: 'Square of Sum', expr: '(a + b)² = a² + 2ab + b²', explanation: 'Expand the square of a binomial sum.', example: '(23)²=(20+3)²=400+120+9=529', userAdded: false, starred: false },
  { id: 9, topic: 'Algebra', name: 'Difference of Squares', expr: 'a² − b² = (a + b)(a − b)', explanation: 'Factor a difference of two perfect squares.', example: '99²−1²=(100)(98)=9800', userAdded: false, starred: false },
  { id: 10, topic: 'Geometry', name: 'Area of Circle', expr: 'A = π r²', explanation: 'Area enclosed by a circle of radius r.', example: 'r=7 → A=154 sq units', userAdded: false, starred: false },
  { id: 11, topic: 'Geometry', name: 'Pythagoras Theorem', expr: 'a² + b² = c²', explanation: 'Relation between sides of a right-angled triangle.', example: '3²+4²=5² → 9+16=25 ✓', userAdded: false, starred: false },
  { id: 12, topic: 'Probability', name: 'Basic Probability', expr: 'P(E) = n(E) / n(S)', explanation: 'Probability of event E = favourable outcomes / total outcomes.', example: 'P(Head) = 1/2', userAdded: false, starred: false },
];

const EMPTY_FORM = { topic: TOPICS[0], name: '', expr: '', explanation: '', example: '' };

export default function FormulaPage() {
  const [formulas, setFormulas] = useState(SEED);
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | formula-object (edit)
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => { setForm({ ...EMPTY_FORM, topic: activeTopic }); setModal('add'); };
  const openEdit = (f) => { setForm({ topic: f.topic, name: f.name, expr: f.expr, explanation: f.explanation, example: f.example }); setModal(f); };
  const closeModal = () => setModal(null);

  const saveFormula = () => {
    if (!form.name.trim() || !form.expr.trim()) return;
    if (modal === 'add') {
      setFormulas(prev => [{ ...form, id: Date.now(), userAdded: true, starred: false }, ...prev]);
    } else {
      setFormulas(prev => prev.map(f => f.id === modal.id ? { ...f, ...form } : f));
    }
    closeModal();
  };

  const deleteFormula = (id) => setFormulas(prev => prev.filter(f => f.id !== id));
  const toggleStar = (id) => setFormulas(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f));

  const visible = formulas
    .filter(f => f.topic === activeTopic)
    .filter(f => !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.topic.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.starred - a.starred);

  return (
    <div className="apt-page">
      <div className="apt-header">
        <div className="apt-header__left">
          <div className="apt-header__icon"><FlaskConical size={18} /></div>
          <h1 className="apt-header__title">Formula Library</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="apt-search">
            <Search size={14} />
            <input placeholder="Search formulas…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <button className="apt-add-btn" onClick={openAdd}><Plus size={14} /> Add Formula</button>
        </div>
      </div>

      <div className="apt-formula-layout">
        <div className="apt-formula-sidebar">
          {TOPICS.map(t => (
            <button
              key={t}
              className={`apt-formula-sidebar__btn ${activeTopic === t ? 'active' : ''}`}
              onClick={() => setActiveTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="apt-formula-content">
          {visible.length === 0 ? (
            <div className="apt-empty">
              <FlaskConical size={40} />
              <p>No formulas yet — tap + Add Formula to create your first one.</p>
            </div>
          ) : (
            <div className="apt-grid">
              {visible.map(f => (
                <div key={f.id} className="apt-formula-card">
                  <div className="apt-formula-card__top">
                    <p className="apt-formula-card__name">{f.name}</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className={`apt-card__icon-btn ${f.starred ? 'starred' : ''}`} onClick={() => toggleStar(f.id)} title="Favourite">
                        <Star size={13} fill={f.starred ? '#f59e0b' : 'none'} />
                      </button>
                      {f.userAdded && (
                        <>
                          <button className="apt-card__icon-btn" onClick={() => openEdit(f)} title="Edit"><Pencil size={13} /></button>
                          <button className="apt-card__icon-btn danger" onClick={() => deleteFormula(f.id)} title="Delete"><Trash2 size={13} /></button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="apt-formula-card__expr">{f.expr}</div>
                  <p className="apt-formula-card__explanation">{f.explanation}</p>
                  {f.example && <p className="apt-formula-card__example">Example: {f.example}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="apt-modal-overlay" onClick={closeModal}>
          <div className="apt-modal" onClick={e => e.stopPropagation()}>
            <div className="apt-modal__header">
              <p className="apt-modal__title">{modal === 'add' ? 'Add Formula' : 'Edit Formula'}</p>
              <button className="apt-modal__close" onClick={closeModal}><X size={14} /></button>
            </div>
            <div className="apt-modal__form">
              <div className="apt-modal__field">
                <label className="apt-modal__label">Topic</label>
                <select className="apt-modal__select" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}>
                  {TOPICS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="apt-modal__field">
                <label className="apt-modal__label">Formula Name</label>
                <input className="apt-modal__input" placeholder="e.g. Compound Interest" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="apt-modal__field">
                <label className="apt-modal__label">Expression</label>
                <input className="apt-modal__input" placeholder="e.g. A = P(1 + r/n)^nt" value={form.expr} onChange={e => setForm(p => ({ ...p, expr: e.target.value }))} />
              </div>
              <div className="apt-modal__field">
                <label className="apt-modal__label">Explanation</label>
                <textarea className="apt-modal__textarea" placeholder="Short explanation…" value={form.explanation} onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))} />
              </div>
              <div className="apt-modal__field">
                <label className="apt-modal__label">Example (optional)</label>
                <input className="apt-modal__input" placeholder="e.g. P=1000, r=10%, n=2 → A=1210" value={form.example} onChange={e => setForm(p => ({ ...p, example: e.target.value }))} />
              </div>
            </div>
            <div className="apt-modal__footer">
              <button className="apt-modal__cancel" onClick={closeModal}>Cancel</button>
              <button className="apt-modal__save" onClick={saveFormula}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
