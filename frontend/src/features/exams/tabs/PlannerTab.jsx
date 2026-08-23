import { CalendarDays } from 'lucide-react';

export default function PlannerTab({ data, loading }) {
  if (loading) return <div className="tab-loading">Loading planner...</div>;
  const planner = data?.planner ?? [];

  return (
    <div className="tab-section">
      <div className="tab-section__header"><CalendarDays size={16} /><h3>Study Planner</h3></div>
      {planner.length === 0
        ? <div className="tab-empty">No plan added yet.</div>
        : (
          <ul className="planner-list">
            {planner.map((item, i) => (
              <li key={i} className="planner-list__item">
                <span className="planner-list__date">{item.date}</span>
                <span className="planner-list__task">{item.task}</span>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
