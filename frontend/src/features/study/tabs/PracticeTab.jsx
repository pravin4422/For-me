import { PenLine, Plus } from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';

export default function PracticeTab() {
  const { loading } = useStudyData();

  if (loading) return <div className="tab-loading">Loading practice…</div>;

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <PenLine size={18} />
          <h2>Practice</h2>
        </div>
        <button className="btn-primary"><Plus size={14} /> New Session</button>
      </div>
      <div className="tab-empty">
        <PenLine size={40} />
        <p>No practice sessions yet — start your first session.</p>
      </div>
    </div>
  );
}
