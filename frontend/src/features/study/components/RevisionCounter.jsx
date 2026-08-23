import { RotateCcw } from 'lucide-react';

export default function RevisionCounter({ topicId, count, onIncrement }) {
  return (
    <div className="revision-counter">
      <button
        className="revision-counter__btn"
        onClick={() => onIncrement(topicId)}
        title="Mark as revised"
      >
        <RotateCcw size={14} />
      </button>
      <span className="revision-counter__count">{count}</span>
      <span className="revision-counter__label">revision{count !== 1 ? 's' : ''}</span>
    </div>
  );
}
