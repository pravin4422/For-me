import { ListChecks } from 'lucide-react';

export default function TopicsTab({ data, loading }) {
  if (loading) return <div className="tab-loading">Loading topics...</div>;
  const topics = data?.topics ?? [];

  return (
    <div className="tab-section">
      <div className="tab-section__header"><ListChecks size={16} /><h3>Topics</h3></div>
      {topics.length === 0
        ? <div className="tab-empty">No topics added yet.</div>
        : (
          <ul className="topics-list">
            {topics.map((t, i) => (
              <li key={i} className="topics-list__item">
                <span className={`topics-list__status topics-list__status--${t.status ?? 'pending'}`} />
                <span>{t.name}</span>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
