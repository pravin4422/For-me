import { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function AddTopicModal({ subjects, onSave, onClose }) {
  const [name, setName]           = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '');
  const [description, setDesc]    = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), subjectId, description: description.trim() });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>Add Topic</h3>
          <button className="modal__close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal__body">
          <input
            className="modal__input"
            placeholder="Topic name *"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <select
            className="modal__input"
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <textarea
            className="modal__input modal__textarea"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDesc(e.target.value)}
          />
        </div>
        <div className="modal__footer">
          <button className="btn-primary" onClick={handleSave}><Check size={13} /> Save</button>
          <button className="btn-ghost" onClick={onClose}><X size={13} /> Cancel</button>
        </div>
      </div>
    </div>
  );
}
