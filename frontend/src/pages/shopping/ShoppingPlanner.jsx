import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ShoppingCart, Plus, LayoutGrid, List, Pencil, Trash2,
  CheckCircle2, Circle, ExternalLink, Paperclip, X, SlidersHorizontal,
  Package, IndianRupee, Image as ImageIcon, FileText, Link as LinkIcon,
  StickyNote, Calendar, ChevronDown
} from 'lucide-react';
import './ShoppingPlanner.css';

/* ─── palette constants ─────────────────────────────────── */
const C = {
  indigo:  '#343090',
  violet:  '#5f59f7',
  blue:    '#6592fd',
  sky:     '#44c2fd',
  purple:  '#8c61ff',
};

/* ─── mock data ─────────────────────────────────────────── */
const today = new Date();
const d = (offset) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split('T')[0];
};
const m = (monthOffset) => {
  const dt = new Date(today);
  dt.setMonth(dt.getMonth() + monthOffset);
  return dt.toISOString().split('T')[0];
};

let _id = 1;
const mk = (o) => ({ id: _id++, purchased: false, image: '', document: '', link: '', notes: '', ...o });

const INITIAL_ITEMS = [
  mk({ name: 'Mechanical Keyboard', type: 'Required', priority: 'High',   amount: 3500, date: d(2),   link: 'https://amazon.in', notes: 'TKL layout preferred' }),
  mk({ name: 'Desk Lamp',           type: 'Optional', priority: 'Medium', amount: 850,  date: d(4),   link: '', notes: '' }),
  mk({ name: 'Notebook Set',        type: 'Required', priority: 'High',   amount: 220,  date: d(1),   link: '', notes: '5-pack ruled' }),
  mk({ name: 'USB Hub',             type: 'Required', priority: 'Medium', amount: 1200, date: d(6),   link: 'https://flipkart.com', notes: '' }),
  mk({ name: 'Wireless Mouse',      type: 'Optional', priority: 'Low',    amount: 650,  date: m(1),   link: '', notes: 'Ergonomic' }),
  mk({ name: 'Monitor Stand',       type: 'Required', priority: 'High',   amount: 1800, date: m(1),   link: '', notes: '' }),
  mk({ name: 'Protein Powder',      type: 'Optional', priority: 'Medium', amount: 2200, date: m(1),   link: '', notes: '1kg whey' }),
  mk({ name: 'Running Shoes',       type: 'Required', priority: 'High',   amount: 4500, date: m(2),   link: '', notes: 'Size 9' }),
  mk({ name: 'Backpack',            type: 'Required', priority: 'Medium', amount: 2800, date: m(2),   link: '', notes: '30L laptop bag' }),
  mk({ name: 'Smart Watch',         type: 'Optional', priority: 'Low',    amount: 8999, date: m(3),   link: '', notes: '' }),
  mk({ name: 'Bookshelf',           type: 'Required', priority: 'Medium', amount: 3200, date: m(4),   link: '', notes: '5-tier' }),
  mk({ name: 'Air Purifier',        type: 'Optional', priority: 'Low',    amount: 12000,date: m(6),   link: '', notes: '' }),
];

/* ─── helpers ───────────────────────────────────────────── */
const TABS = ['Weekly', 'Monthly', 'Yearly', 'All Items', 'Purchased'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const TYPES = ['Required', 'Optional'];

function getWeekRange() {
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function inWeek(dateStr) {
  const { start, end } = getWeekRange();
  const d = new Date(dateStr);
  return d >= start && d <= end;
}

function inMonth(dateStr) {
  const d = new Date(dateStr);
  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

function inYear(dateStr) {
  return new Date(dateStr).getFullYear() === today.getFullYear();
}

function filterByTab(items, tab) {
  const pending = items.filter(i => !i.purchased);
  if (tab === 'Purchased') return items.filter(i => i.purchased);
  if (tab === 'Weekly')    return pending.filter(i => inWeek(i.date));
  if (tab === 'Monthly')   return pending.filter(i => inMonth(i.date));
  if (tab === 'Yearly')    return pending.filter(i => inYear(i.date));
  return pending;
}

function priorityColor(p) {
  if (p === 'High')   return C.purple;
  if (p === 'Medium') return C.blue;
  return C.sky;
}

function typeColor(t) {
  return t === 'Required' ? C.purple : C.sky;
}

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

/* ─── empty form ────────────────────────────────────────── */
const emptyForm = () => ({
  name: '', type: 'Required', priority: 'High',
  amount: '', date: d(0), link: '', image: '', document: '', notes: '',
});

/* ─── ItemCard ──────────────────────────────────────────── */
function ItemCard({ item, onEdit, onDelete, onToggle, grid }) {
  return (
    <div className={`sp-card ${grid ? 'sp-card--grid' : 'sp-card--list'}`}>
      <div className="sp-card-thumb">
        {item.image
          ? <img src={item.image} alt={item.name} />
          : <div className="sp-card-thumb-placeholder"><Package size={22} /></div>
        }
      </div>
      <div className="sp-card-body">
        <div className="sp-card-top">
          <span className="sp-card-name">{item.name}</span>
          <div className="sp-card-tags">
            <span className="sp-tag" style={{ background: typeColor(item.type) + '22', color: typeColor(item.type), border: `1px solid ${typeColor(item.type)}44` }}>{item.type}</span>
            <span className="sp-tag" style={{ background: priorityColor(item.priority) + '22', color: priorityColor(item.priority), border: `1px solid ${priorityColor(item.priority)}44` }}>{item.priority}</span>
          </div>
        </div>
        <div className="sp-card-meta">
          <span className="sp-meta-item"><IndianRupee size={13} />{fmt(item.amount)}</span>
          <span className="sp-meta-item"><Calendar size={13} />{item.date}</span>
        </div>
        {item.notes && <p className="sp-card-notes">{item.notes}</p>}
        <div className="sp-card-actions">
          <div className="sp-card-links">
            {item.link     && <a href={item.link} target="_blank" rel="noreferrer" className="sp-link-btn" title="Open link"><ExternalLink size={14} /></a>}
            {item.document && <span className="sp-link-btn" title="Document"><Paperclip size={14} /></span>}
          </div>
          <div className="sp-card-btns">
            <button className="sp-icon-btn" onClick={() => onToggle(item.id)} title={item.purchased ? 'Mark pending' : 'Mark purchased'}>
              {item.purchased ? <CheckCircle2 size={16} style={{ color: C.violet }} /> : <Circle size={16} />}
            </button>
            <button className="sp-icon-btn" onClick={() => onEdit(item)}><Pencil size={14} /></button>
            <button className="sp-icon-btn sp-icon-btn--del" onClick={() => onDelete(item.id)}><Trash2 size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal ─────────────────────────────────────────────── */
function Modal({ form, setForm, onSave, onClose, editing }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return createPortal(
    <div className="sp-overlay" onClick={onClose}>
      <div className="sp-modal" onClick={e => e.stopPropagation()}>
        <div className="sp-modal-header">
          <span>{editing ? 'Edit Item' : 'Add Item'}</span>
          <button className="sp-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="sp-modal-body">
          <div className="sp-form-row">
            <label>Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Mechanical Keyboard" />
          </div>
          <div className="sp-form-2col">
            <div className="sp-form-row">
              <label>Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="sp-form-row">
              <label>Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="sp-form-2col">
            <div className="sp-form-row">
              <label><IndianRupee size={13} /> Estimated Amount</label>
              <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" />
            </div>
            <div className="sp-form-row">
              <label><Calendar size={13} /> Purchase Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>
          <div className="sp-form-row">
            <label><LinkIcon size={13} /> Product Link</label>
            <input value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://..." />
          </div>
          <div className="sp-form-row">
            <label><ImageIcon size={13} /> Image URL</label>
            <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
          </div>
          <div className="sp-form-row">
            <label><Paperclip size={13} /> Document (mock ref)</label>
            <input value={form.document} onChange={e => set('document', e.target.value)} placeholder="filename.pdf" />
          </div>
          <div className="sp-form-row">
            <label><StickyNote size={13} /> Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any notes..." />
          </div>
        </div>
        <div className="sp-modal-footer">
          <button className="sp-btn sp-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="sp-btn sp-btn--primary" onClick={onSave} disabled={!form.name.trim()}>
            {editing ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function ShoppingPlanner() {
  const [items, setItems]       = useState(INITIAL_ITEMS);
  const [tab, setTab]           = useState('All Items');
  const [grid, setGrid]         = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(emptyForm());
  const [editId, setEditId]     = useState(null);
  const [filterPri, setFilterPri] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showFilter, setShowFilter] = useState(false);

  const pending = items.filter(i => !i.purchased);
  const totalCost = pending.reduce((s, i) => s + Number(i.amount || 0), 0);

  const tabItems = useMemo(() => {
    let list = filterByTab(items, tab);
    if (filterPri  !== 'All') list = list.filter(i => i.priority === filterPri);
    if (filterType !== 'All') list = list.filter(i => i.type === filterType);
    return list;
  }, [items, tab, filterPri, filterType]);

  const tabCost = tabItems.filter(i => !i.purchased).reduce((s, i) => s + Number(i.amount || 0), 0);

  const openAdd  = () => { setForm(emptyForm()); setEditId(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditId(item.id); setModal(true); };
  const closeModal = () => setModal(false);

  const saveItem = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i));
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now(), purchased: false }]);
    }
    closeModal();
  };

  const deleteItem  = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const toggleItem  = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i));

  return (
    <div className="sp-page">
      {/* ── summary strip ── */}
      <div className="sp-summary">
        <div className="sp-summary-card">
          <div className="sp-summary-icon" style={{ background: C.indigo + '22', color: C.indigo }}>
            <ShoppingCart size={20} />
          </div>
          <div>
            <div className="sp-summary-val">{pending.length}</div>
            <div className="sp-summary-label">Items Pending</div>
          </div>
        </div>
        <div className="sp-summary-card">
          <div className="sp-summary-icon" style={{ background: C.violet + '22', color: C.violet }}>
            <IndianRupee size={20} />
          </div>
          <div>
            <div className="sp-summary-val">{fmt(totalCost)}</div>
            <div className="sp-summary-label">Total Estimated Cost</div>
          </div>
        </div>
        <button className="sp-btn sp-btn--primary sp-add-btn" onClick={openAdd}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* ── tabs ── */}
      <div className="sp-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`sp-tab ${tab === t ? 'sp-tab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── toolbar ── */}
      <div className="sp-toolbar">
        <div className="sp-toolbar-left">
          {tab !== 'Purchased' && tab !== 'All Items' && (
            <span className="sp-bucket-cost">
              <IndianRupee size={13} /> {fmt(tabCost)} estimated this {tab.replace(' Items','').toLowerCase()}
            </span>
          )}
        </div>
        <div className="sp-toolbar-right">
          <div className="sp-filter-wrap">
            <button className="sp-btn sp-btn--ghost sp-filter-btn" onClick={() => setShowFilter(o => !o)}>
              <SlidersHorizontal size={14} /> Filter <ChevronDown size={12} />
            </button>
            {showFilter && (
              <div className="sp-filter-dropdown">
                <div className="sp-filter-group">
                  <span>Priority</span>
                  {['All', ...PRIORITIES].map(p => (
                    <button key={p} className={`sp-filter-chip ${filterPri === p ? 'active' : ''}`}
                      style={filterPri === p ? { background: priorityColor(p === 'All' ? 'Medium' : p), color: '#fff', borderColor: 'transparent' } : {}}
                      onClick={() => setFilterPri(p)}>{p}</button>
                  ))}
                </div>
                <div className="sp-filter-group">
                  <span>Type</span>
                  {['All', ...TYPES].map(t => (
                    <button key={t} className={`sp-filter-chip ${filterType === t ? 'active' : ''}`}
                      style={filterType === t ? { background: typeColor(t === 'All' ? 'Required' : t), color: '#fff', borderColor: 'transparent' } : {}}
                      onClick={() => setFilterType(t)}>{t}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className={`sp-view-btn ${grid ? 'active' : ''}`} onClick={() => setGrid(true)}><LayoutGrid size={16} /></button>
          <button className={`sp-view-btn ${!grid ? 'active' : ''}`} onClick={() => setGrid(false)}><List size={16} /></button>
        </div>
      </div>

      {/* ── items ── */}
      {tabItems.length === 0 ? (
        <div className="sp-empty">
          <div className="sp-empty-icon"><ShoppingCart size={32} /></div>
          <p>No items yet — add your first one</p>
          <button className="sp-btn sp-btn--primary" onClick={openAdd}><Plus size={15} /> Add Item</button>
        </div>
      ) : (
        <div className={grid ? 'sp-grid' : 'sp-list'}>
          {tabItems.map(item => (
            <ItemCard key={item.id} item={item} grid={grid}
              onEdit={openEdit} onDelete={deleteItem} onToggle={toggleItem} />
          ))}
        </div>
      )}

      {/* ── modal ── */}
      {modal && <Modal form={form} setForm={setForm} onSave={saveItem} onClose={closeModal} editing={!!editId} />}
    </div>
  );
}
