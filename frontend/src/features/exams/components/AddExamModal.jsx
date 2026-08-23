import { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function AddExamModal({ category, onAdd, onClose }) {
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ id: name.toLowerCase().replace(/\s+/g, '-'), name: name.trim(), description: description.trim(), category });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>Add Exam</h3>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <input
            className="exam-input"
            placeholder="Exam name *"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <textarea
            className="exam-input exam-textarea"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="modal__footer">
          <button className="btn-primary" onClick={handleSubmit}><Check size={14} /> Add</button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
