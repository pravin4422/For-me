import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useTopics } from '../hooks/useTopics';
import RevisionCounter from '../components/RevisionCounter';

export default function RevisionTrackerTab() {
  const { topics, loading } = useTopics();
  const [counts, setCounts] = useState({});

  const increment = (topicId) =>
    setCounts(p => ({ ...p, [topicId]: (p[topicId] ?? 0) + 1 }));

  if (loading) return <div className="tab-loading">Loading revision tracker…</div>;

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <RotateCcw size={18} />
          <h2>Revision Tracker</h2>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="tab-empty">
          <RotateCcw size={40} />
          <p>No topics found — add topics first to track revisions.</p>
        </div>
      ) : (
        <div className="revision-list">
          {topics.map(t => (
            <div key={t.id} className="revision-row">
              <span className="revision-row__name">{t.name}</span>
              <RevisionCounter
                topicId={t.id}
                count={counts[t.id] ?? 0}
                onIncrement={increment}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
