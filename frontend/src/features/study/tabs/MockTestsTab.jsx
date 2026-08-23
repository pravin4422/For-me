import { ClipboardList, Plus } from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';

export default function MockTestsTab() {
  const { loading } = useStudyData();

  if (loading) return <div className="tab-loading">Loading mock tests…</div>;

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <ClipboardList size={18} />
          <h2>Mock Tests</h2>
        </div>
        <button className="btn-primary"><Plus size={14} /> New Test</button>
      </div>
      <div className="tab-empty">
        <ClipboardList size={40} />
        <p>No mock tests yet — create your first test.</p>
      </div>
    </div>
  );
}
