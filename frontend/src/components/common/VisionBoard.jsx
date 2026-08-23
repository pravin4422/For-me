import { useState } from 'react';
import { X, Pin, GripVertical } from 'lucide-react';
import './VisionBoard.css';

export default function VisionBoard({ quotes = [], images = [], goals = [], pinned: initPinned = [], onPinnedChange }) {
  const [pinned, setPinned] = useState(initPinned);
  const [dragOver, setDragOver] = useState(null);
  const [dragging, setDragging] = useState(null);

  const notify = (next) => { setPinned(next); onPinnedChange?.(next); };

  const removePin = (id) => notify(pinned.filter(p => p.id !== id));

  const addItem = (item) => {
    if (pinned.find(p => p.id === item.id)) return;
    notify([...pinned, item]);
  };

  const onDragStart = (e, idx) => { setDragging(idx); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver  = (e, idx) => { e.preventDefault(); setDragOver(idx); };
  const onDrop      = (e, idx) => {
    e.preventDefault();
    if (dragging === null || dragging === idx) { setDragOver(null); setDragging(null); return; }
    const next = [...pinned];
    const [moved] = next.splice(dragging, 1);
    next.splice(idx, 0, moved);
    notify(next);
    setDragOver(null); setDragging(null);
  };

  const unpinned = [
    ...quotes.map(q => ({ ...q, kind: 'quote' })),
    ...images.map(i => ({ ...i, kind: 'image' })),
    ...goals.map(g => ({ ...g, kind: 'goal' })),
  ].filter(item => !pinned.find(p => p.id === item.id));

  return (
    <div className="vb-root">
      <div className="vb-board">
        {pinned.length === 0 && (
          <div className="vb-empty">No items pinned yet — add from the panel below.</div>
        )}
        {pinned.map((item, idx) => (
          <div
            key={item.id}
            className={`vb-tile vb-tile--${item.kind} ${dragOver === idx ? 'vb-tile--dragover' : ''}`}
            draggable
            onDragStart={e => onDragStart(e, idx)}
            onDragOver={e => onDragOver(e, idx)}
            onDrop={e => onDrop(e, idx)}
            onDragLeave={() => setDragOver(null)}
          >
            <button className="vb-remove" onClick={() => removePin(item.id)}><X size={12} /></button>
            <span className="vb-drag-handle"><GripVertical size={13} /></span>
            {item.kind === 'quote' && (
              <>
                <p className="vb-quote-text">"{item.text}"</p>
                {item.author && <span className="vb-quote-author">— {item.author}</span>}
              </>
            )}
            {item.kind === 'image' && (
              <img src={item.src} alt={item.caption || 'vision'} className="vb-img" />
            )}
            {item.kind === 'goal' && (
              <>
                <span className="vb-goal-cat">{item.category}</span>
                <p className="vb-goal-title">{item.title}</p>
                <span className={`vb-goal-status vb-goal-status--${item.status.replace(/\s+/g, '-').toLowerCase()}`}>{item.status}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {unpinned.length > 0 && (
        <div className="vb-picker">
          <p className="vb-picker-label"><Pin size={13} /> Pin to board</p>
          <div className="vb-picker-list">
            {unpinned.map(item => (
              <button key={item.id} className="vb-picker-item" onClick={() => addItem(item)}>
                {item.kind === 'quote' && <span>"{item.text.slice(0, 40)}{item.text.length > 40 ? '…' : ''}"</span>}
                {item.kind === 'image' && <span>Image: {item.caption || item.id}</span>}
                {item.kind === 'goal'  && <span>Goal: {item.title}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
