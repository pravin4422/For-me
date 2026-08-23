import { CalendarDays, Plus } from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';

export default function StudyPlannerTab() {
  const { loading } = useStudyData();

  if (loading) return <div className="tab-loading">Loading planner…</div>;

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <CalendarDays size={18} />
          <h2>Study Planner</h2>
        </div>
        <button className="btn-primary"><Plus size={14} /> New Plan</button>
      </div>
      <div className="tab-empty">
        <CalendarDays size={40} />
        <p>No study plans yet — create your first plan.</p>
      </div>
    </div>
  );
}
