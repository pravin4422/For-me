import { useState } from 'react';
import { Pencil, Trash2, Check, X, Paperclip } from 'lucide-react';

const fmt = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? v : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
};

export default function BudgetEntryList({ entries, fields, onDelete, onEdit, amountKey = 'amount' }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (entry) => { setEditId(entry._id ?? entry.id); setEditData({ ...entry }); };
  const saveEdit = () => { onEdit(editData); setEditId(null); };

  if (!entries.length) return (
    <div className="bgt-empty">
      <span>No entries yet — add your first one</span>
    </div>
  );

  return (
    <div className="bgt-list">
      {entries.map(entry => (
        <div key={entry._id ?? entry.id} className="bgt-list-row">
          {editId === (entry._id ?? entry.id) ? (
            <>
              <div className="bgt-edit-grid">
                {fields.filter(f => f.type !== 'file').map(f => (
                  <div key={f.key} className="bgt-field-sm">
                    <label>{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={editData[f.key] || ''} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}>
                        <option value="">Select</option>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea value={editData[f.key] || ''} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} rows={2} />
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={editData[f.key] || ''}
                        onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="bgt-row-actions">
                <button className="bgt-icon-btn green" onClick={saveEdit}><Check size={14} /></button>
                <button className="bgt-icon-btn muted" onClick={() => setEditId(null)}><X size={14} /></button>
              </div>
            </>
          ) : (
            <>
              <div className="bgt-row-info">
                <span className="bgt-row-primary">{entry[fields[0].key]}</span>
                <span className="bgt-row-amount">{fmt(entry[amountKey])}</span>
                {entry.category && <span className="bgt-row-badge">{entry.category}</span>}
                {entry.salaryType && entry.salaryType !== 'N/A' && (
                  <span className="bgt-row-badge muted">{entry.salaryType}</span>
                )}
                {entry.date && <span className="bgt-row-meta">{entry.date}</span>}
                {entry.notes && <span className="bgt-row-notes">{entry.notes}</span>}
                {entry.statement && (
                  <span className="bgt-row-attachment">
                    <Paperclip size={12} />
                    {entry.statement.name || 'Statement'}
                  </span>
                )}
              </div>
              <div className="bgt-row-actions">
                <button className="bgt-icon-btn" onClick={() => startEdit(entry)}><Pencil size={14} /></button>
                <button className="bgt-icon-btn red" onClick={() => onDelete(entry._id ?? entry.id)}><Trash2 size={14} /></button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
