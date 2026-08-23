import { ClipboardList } from 'lucide-react';

export default function MockTestsTab({ examId }) {
  return (
    <div className="tab-section">
      <div className="tab-section__header"><ClipboardList size={16} /><h3>Mock Tests</h3></div>
      <div className="tab-empty">No mock tests available for this exam yet.</div>
    </div>
  );
}
