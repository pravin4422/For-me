import { BarChart2 } from 'lucide-react';

export default function AnalysisTab({ examId }) {
  return (
    <div className="tab-section">
      <div className="tab-section__header"><BarChart2 size={16} /><h3>Analysis</h3></div>
      <div className="tab-empty">No analysis data available yet.</div>
    </div>
  );
}
