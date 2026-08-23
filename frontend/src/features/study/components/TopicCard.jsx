import { FileText, Trash2, Pencil } from 'lucide-react';

export default function TopicCard({ topic, onEdit, onDelete, onClick }) {
  return (
    <div className="topic-card" onClick={onClick}>
      <div className="topic-card__icon"><FileText size={18} /></div>
      <div className="topic-card__info">
        <h4 className="topic-card__name">{topic.name}</h4>
        {topic.description && (
          <p className="topic-card__desc">{topic.description}</p>
        )}
      </div>
      <div className="topic-card__actions" onClick={e => e.stopPropagation()}>
        <button className="icon-btn" onClick={() => onEdit(topic)}><Pencil size={13} /></button>
        <button className="icon-btn icon-btn--danger" onClick={() => onDelete(topic.id)}><Trash2 size={13} /></button>
      </div>
    </div>
  );
}
