import { useNavigate } from 'react-router-dom';
import { ClipboardList, BarChart2, History } from 'lucide-react';
import './MockTestDashboard.css';

export default function MockTestDashboard() {
  const navigate = useNavigate();
  return (
    <div className="mt-dashboard">
      <h2 className="mt-dash-title">Mock Test Center</h2>
      <p className="mt-dash-sub">Simulate real exam conditions. Track your performance. Identify weak areas.</p>
      <div className="mt-dash-cards">
        <div className="mt-dash-card" onClick={() => navigate('/dashboard/mock-test/setup/select')}>
          <ClipboardList size={32} />
          <h3>Start New Mock Test</h3>
          <p>Select exam, subject, and topic to begin a timed test.</p>
        </div>
        <div className="mt-dash-card" onClick={() => navigate('/dashboard/mock-test/results')}>
          <History size={32} />
          <h3>Past Results</h3>
          <p>Review your previous test scores and performance history.</p>
        </div>
        <div className="mt-dash-card" onClick={() => navigate('/dashboard/mock-test/analysis')}>
          <BarChart2 size={32} />
          <h3>Performance Analysis</h3>
          <p>Identify weak topics and get revision recommendations.</p>
        </div>
      </div>
    </div>
  );
}
