import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function BudgetEntryForm({ fields, onAdd, accentColor = '#5f59f7' }) {
  const init = Object.fromEntries(fields.map(f => [f.key, '']));
  const [form, setForm] = useState(init);
  const [open, setOpen] = useState(false);

  const handle = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const required = fields.filter(f => f.required !== false);
    if (required.some(f => !form[f.key])) return;
    onAdd({ ...form, id: Date.now() });
    setForm(init);
    setOpen(false);
  };

  if (!open) return (
    <button className="bgt-add-btn" onClick={() => setOpen(true)} style={{ background: accentColor }}>
      <Plus size={15} /> Add Entry
    </button>
  );

  return (
    <form className="bgt-form" onSubmit={submit}>
      <div className="bgt-form-grid">
        {fields.map(f => (
          <div key={f.key} className="bgt-field">
            <label>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea value={form[f.key]} onChange={e => handle(f.key, e.target.value)} placeholder={f.placeholder || f.label} rows={2} />
            ) : (
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => handle(f.key, e.target.value)}
                placeholder={f.placeholder || f.label}
              />
            )}
          </div>
        ))}
      </div>
      <div className="bgt-form-actions">
        <button type="submit" className="bgt-btn-primary" style={{ background: accentColor }}>
          <Plus size={14} /> Add
        </button>
        <button type="button" className="bgt-btn-ghost" onClick={() => { setOpen(false); setForm(init); }}>
          <X size={14} /> Cancel
        </button>
      </div>
    </form>
  );
}
