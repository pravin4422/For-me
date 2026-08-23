import { useState, useRef, useEffect } from 'react';
import {
  FolderOpen, Search, Upload, Pin, MoreVertical, Eye, Pencil,
  Trash2, FolderInput, X, Check, Image as ImageIcon, FileText,
  FileSpreadsheet, File, Plus, ChevronDown
} from 'lucide-react';
import './DocumentPage.css';

// ── palette ──────────────────────────────────────────────────
const C = {
  indigo: '#343090',
  violet: '#5f59f7',
  blue:   '#6592fd',
  sky:    '#44c2fd',
  purple: '#8c61ff',
};

// ── file-type helpers ─────────────────────────────────────────
const EXT_META = {
  pdf:  { label: 'PDF', color: C.violet },
  doc:  { label: 'DOC', color: C.blue },
  docx: { label: 'DOC', color: C.blue },
  xls:  { label: 'XLS', color: C.sky },
  xlsx: { label: 'XLS', color: C.sky },
  ppt:  { label: 'PPT', color: C.purple },
  pptx: { label: 'PPT', color: C.purple },
  png:  { label: 'PNG', color: C.indigo },
  jpg:  { label: 'JPG', color: C.indigo },
  jpeg: { label: 'JPG', color: C.indigo },
  txt:  { label: 'TXT', color: C.blue },
};

function extOf(name) { return name.split('.').pop().toLowerCase(); }
function metaOf(name) { return EXT_META[extOf(name)] || { label: extOf(name).toUpperCase(), color: C.blue }; }

function FileIcon({ name, size = 32 }) {
  const ext = extOf(name);
  if (['png','jpg','jpeg','gif','webp'].includes(ext)) return <ImageIcon size={size} color={C.indigo} />;
  if (['xls','xlsx'].includes(ext)) return <FileSpreadsheet size={size} color={C.sky} />;
  if (['pdf'].includes(ext)) return <FileText size={size} color={C.violet} />;
  if (['doc','docx','txt'].includes(ext)) return <FileText size={size} color={C.blue} />;
  return <File size={size} color={C.purple} />;
}

// ── categories ────────────────────────────────────────────────
const CATEGORIES = ['Original Documents', 'Worksheets', 'Personal Documents', 'Study Documents', 'Images'];

// ── mock data ─────────────────────────────────────────────────
let _id = 1;
const mk = (name, category, size, daysAgo, freq = false, thumb = null) => ({
  id: _id++,
  name,
  category,
  size,
  date: new Date(Date.now() - daysAgo * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  frequent: freq,
  thumb,
});

const INIT_FILES = [
  mk('Aadhaar_Card.pdf',           'Original Documents', '1.2 MB', 10, true),
  mk('PAN_Card.pdf',               'Original Documents', '0.8 MB', 20, true),
  mk('Birth_Certificate.pdf',      'Original Documents', '0.5 MB', 60),
  mk('Passport_Copy.pdf',          'Original Documents', '2.1 MB', 90),
  mk('10th_Marksheet.pdf',         'Original Documents', '1.4 MB', 120),

  mk('Math_Worksheet_1.xlsx',      'Worksheets', '0.3 MB', 3, true),
  mk('English_Practice.docx',      'Worksheets', '0.2 MB', 7),
  mk('Science_Lab_Sheet.pdf',      'Worksheets', '0.6 MB', 14),
  mk('History_Notes.docx',         'Worksheets', '0.4 MB', 21),

  mk('Resume_2025.docx',           'Personal Documents', '0.9 MB', 5, true),
  mk('Cover_Letter.docx',          'Personal Documents', '0.3 MB', 5),
  mk('Bank_Statement_Apr.pdf',     'Personal Documents', '1.8 MB', 30),
  mk('Insurance_Policy.pdf',       'Personal Documents', '3.2 MB', 45),

  mk('RRB_Study_Plan.pdf',         'Study Documents', '1.1 MB', 2, true),
  mk('SSC_Previous_Papers.pdf',    'Study Documents', '4.5 MB', 8),
  mk('Aptitude_Shortcuts.docx',    'Study Documents', '0.7 MB', 15),
  mk('Current_Affairs_May.pdf',    'Study Documents', '2.3 MB', 22),
  mk('Vocabulary_List.xlsx',       'Study Documents', '0.4 MB', 30),

  mk('Profile_Photo.jpg',          'Images', '0.6 MB', 4, false, 'https://picsum.photos/seed/profile/300/200'),
  mk('Study_Desk.jpg',             'Images', '1.2 MB', 9, false, 'https://picsum.photos/seed/desk/300/200'),
  mk('Certificate_Scan.png',       'Images', '2.1 MB', 18, false, 'https://picsum.photos/seed/cert/300/200'),
  mk('Vision_Board.jpg',           'Images', '1.8 MB', 25, false, 'https://picsum.photos/seed/vision/300/200'),
  mk('Notes_Photo.jpg',            'Images', '0.9 MB', 33, false, 'https://picsum.photos/seed/notes/300/200'),
];

// ── DocumentCard ──────────────────────────────────────────────
function DocumentCard({ file, onToggleFrequent, onRename, onDelete, onMove, isImageThumb = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(file.name);
  const [moveOpen, setMoveOpen] = useState(false);
  const menuRef = useRef(null);
  const { label, color } = metaOf(file.name);

  const commitRename = () => {
    if (draft.trim()) onRename(file.id, draft.trim());
    setRenaming(false);
  };

  if (isImageThumb) {
    return (
      <div className="doc-img-card">
        <div className="doc-img-thumb-wrap" onClick={() => onMove(file.id, '__preview__')}>
          <img src={file.thumb} alt={file.name} className="doc-img-thumb" />
          <div className="doc-img-overlay">
            <Eye size={18} color="#fff" />
          </div>
        </div>
        <div className="doc-img-footer">
          <span className="doc-img-name">{file.name}</span>
          <div className="doc-img-actions">
            <button
              className={`doc-pin-btn ${file.frequent ? 'active' : ''}`}
              onClick={() => onToggleFrequent(file.id)}
              title="Frequently Used"
            >
              <Pin size={13} fill={file.frequent ? C.sky : 'none'} color={file.frequent ? C.sky : 'currentColor'} />
            </button>
            <button className="doc-icon-btn red" onClick={() => onDelete(file.id)}><Trash2 size={13} /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`doc-card ${file.frequent ? 'doc-card--pinned' : ''}`}>
      <div className="doc-card-icon">
        <FileIcon name={file.name} size={28} />
        <span className="doc-type-badge" style={{ background: `${color}18`, color }}>{label}</span>
      </div>
      <div className="doc-card-body">
        {renaming ? (
          <div className="doc-rename-row">
            <input
              className="doc-rename-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenaming(false); }}
              autoFocus
            />
            <button className="doc-icon-btn" onClick={commitRename}><Check size={13} /></button>
            <button className="doc-icon-btn" onClick={() => setRenaming(false)}><X size={13} /></button>
          </div>
        ) : (
          <span className="doc-card-name">{file.name}</span>
        )}
        <div className="doc-card-meta">
          <span>{file.date}</span>
          <span>{file.size}</span>
        </div>
      </div>
      <div className="doc-card-actions">
        <button
          className={`doc-pin-btn ${file.frequent ? 'active' : ''}`}
          onClick={() => onToggleFrequent(file.id)}
          title="Toggle Frequently Used"
        >
          <Pin size={14} fill={file.frequent ? C.sky : 'none'} color={file.frequent ? C.sky : 'currentColor'} />
        </button>
        <div className="doc-menu-wrap" ref={menuRef}>
          <button className="doc-icon-btn" onClick={() => setMenuOpen(o => !o)}><MoreVertical size={14} /></button>
          {menuOpen && (
            <div className="doc-menu">
              <button className="doc-menu-item" onClick={() => { setMenuOpen(false); }}><Eye size={13} /> Preview</button>
              <button className="doc-menu-item" onClick={() => { setRenaming(true); setMenuOpen(false); }}><Pencil size={13} /> Rename</button>
              <div className="doc-menu-item doc-menu-move" onClick={() => setMoveOpen(o => !o)}>
                <FolderInput size={13} /> Move to
                <ChevronDown size={11} style={{ marginLeft: 'auto' }} />
              </div>
              {moveOpen && (
                <div className="doc-submenu">
                  {CATEGORIES.filter(c => c !== file.category).map(c => (
                    <button key={c} className="doc-menu-item" onClick={() => { onMove(file.id, c); setMenuOpen(false); setMoveOpen(false); }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <button className="doc-menu-item doc-menu-item--danger" onClick={() => { onDelete(file.id); setMenuOpen(false); }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── FrequentStrip ─────────────────────────────────────────────
function FrequentStrip({ files, onToggleFrequent }) {
  if (!files.length) return null;
  return (
    <div className="doc-frequent-strip">
      <div className="doc-frequent-header">
        <Pin size={14} color={C.sky} fill={C.sky} />
        <span>Frequently Used</span>
      </div>
      <div className="doc-frequent-list">
        {files.map(f => (
          <div key={f.id} className="doc-frequent-chip">
            <FileIcon name={f.name} size={16} />
            <span className="doc-frequent-chip-name">{f.name}</span>
            <button
              className="doc-frequent-unpin"
              onClick={() => onToggleFrequent(f.id)}
              title="Unpin"
            >
              <X size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────
export default function DocumentPage({ cat }) {
  const [files, setFiles] = useState(INIT_FILES);
  const [activeTab, setActiveTab] = useState(cat || CATEGORIES[0]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [preview, setPreview] = useState(null);

  // sync tab when route changes
  useEffect(() => { if (cat) setActiveTab(cat); }, [cat]);

  const toggleFrequent = (id) =>
    setFiles(p => p.map(f => f.id === id ? { ...f, frequent: !f.frequent } : f));

  const renameFile = (id, name) =>
    setFiles(p => p.map(f => f.id === id ? { ...f, name } : f));

  const deleteFile = (id) =>
    setFiles(p => p.filter(f => f.id !== id));

  const moveFile = (id, category) => {
    if (category === '__preview__') {
      setPreview(files.find(f => f.id === id));
      return;
    }
    setFiles(p => p.map(f => f.id === id ? { ...f, category } : f));
  };

  const mockUpload = () => {
    const name = `Document_${Date.now()}.pdf`;
    setFiles(p => [...p, mk(name, activeTab, '1.0 MB', 0)]);
  };

  const frequentFiles = files.filter(f => f.frequent);

  const tabFiles = files.filter(f => {
    if (f.category !== activeTab) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'all' && extOf(f.name) !== filterType) return false;
    return true;
  });

  const allTypes = [...new Set(files.map(f => extOf(f.name)))].sort();
  const isImages = activeTab === 'Images';

  return (
    <div className="doc-page">
      {/* ── header ── */}
      <div className="doc-header">
        <div className="doc-header-top">
          <div className="doc-title-row">
            <FolderOpen size={22} color={C.indigo} />
            <h2 className="doc-title">Documents</h2>
          </div>
          <button className="doc-upload-btn" onClick={mockUpload}>
            <Upload size={14} /> Upload
          </button>
        </div>
        <div className="doc-search-row">
          <div className="doc-search-wrap">
            <Search size={14} className="doc-search-icon" />
            <input
              className="doc-search-input"
              placeholder="Search files…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="doc-search-clear" onClick={() => setSearch('')}><X size={12} /></button>}
          </div>
          <select className="doc-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            {allTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* ── frequently used strip ── */}
      <FrequentStrip files={frequentFiles} onToggleFrequent={toggleFrequent} />

      {/* ── category tabs ── */}
      <div className="doc-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`doc-tab ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
            <span className="doc-tab-count">{files.filter(f => f.category === cat).length}</span>
          </button>
        ))}
      </div>

      {/* ── file grid / image grid ── */}
      <div className="doc-section">
        {tabFiles.length === 0 ? (
          <div className="doc-empty">
            <FolderOpen size={36} color={C.blue} />
            <p>No documents yet — upload your first one.</p>
            <button className="doc-upload-btn" onClick={mockUpload}><Plus size={13} /> Upload</button>
          </div>
        ) : isImages ? (
          <div className="doc-img-grid">
            {tabFiles.map(f => (
              <DocumentCard
                key={f.id}
                file={f}
                onToggleFrequent={toggleFrequent}
                onRename={renameFile}
                onDelete={deleteFile}
                onMove={moveFile}
                isImageThumb
              />
            ))}
          </div>
        ) : (
          <div className="doc-file-grid">
            {tabFiles.map(f => (
              <DocumentCard
                key={f.id}
                file={f}
                onToggleFrequent={toggleFrequent}
                onRename={renameFile}
                onDelete={deleteFile}
                onMove={moveFile}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── image preview modal ── */}
      {preview && (
        <div className="doc-modal-overlay" onClick={() => setPreview(null)}>
          <div className="doc-modal" onClick={e => e.stopPropagation()}>
            <button className="doc-modal-close" onClick={() => setPreview(null)}><X size={18} /></button>
            <img src={preview.thumb} alt={preview.name} className="doc-modal-img" />
            <p className="doc-modal-caption">{preview.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
