import { BarChart2 } from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';

export default function AnalysisTab() {
  const { loading } = useStudyData();

  if (loading) return <div className="tab-loading">Loading analysis…</div>;

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <BarChart2 size={18} />
          <h2>Analysis</h2>
        </div>
      </div>
      <div className="tab-empty">
        <BarChart2 size={40} />
        <p>No analysis data yet — complete some practice or mock tests first.</p>
      </div>
    </div>
  );
}
