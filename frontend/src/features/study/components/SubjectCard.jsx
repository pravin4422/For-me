import { BookOpen, Trash2, Pencil } from 'lucide-react';

export default function SubjectCard({ subject, onEdit, onDelete, onClick }) {
  return (
    <div className="subject-card" onClick={onClick}>
      <div className="subject-card__icon"><BookOpen size={20} /></div>
      <div className="subject-card__info">
        <h4 className="subject-card__name">{subject.name}</h4>
        {subject.description && (
          <p className="subject-card__desc">{subject.description}</p>
        )}
      </div>
      <div className="subject-card__actions" onClick={e => e.stopPropagation()}>
        <button className="icon-btn" onClick={() => onEdit(subject)}><Pencil size={13} /></button>
        <button className="icon-btn icon-btn--danger" onClick={() => onDelete(subject.id)}><Trash2 size={13} /></button>
      </div>
    </div>
  );
}
