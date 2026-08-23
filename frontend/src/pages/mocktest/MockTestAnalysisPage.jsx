import { useNavigate } from 'react-router-dom';
import { BarChart2, TrendingUp, Target } from 'lucide-react';
import './MockTestAnalysisPage.css';

function getAllAttempts() {
  const attempts = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.startsWith('result_')) {
      const attemptId = key.replace('result_', '');
      const meta      = JSON.parse(sessionStorage.getItem(`attempt_${attemptId}`) || '{}');
      const result    = JSON.parse(sessionStorage.getItem(key));
      attempts.push({ attemptId, examName: meta.name || 'Mock Test', ...result });
    }
  }
  return attempts.reverse();
}

export default function MockTestAnalysisPage() {
  const navigate = useNavigate();
  const attempts = getAllAttempts();

  return (
    <div className="analysis-overview-page">
      <div className="aop-header">
        <h2>Performance Analysis</h2>
        <button className="btn-new-test" onClick={() => navigate('/dashboard/mock-test/setup/select')}>
          Start New Test
        </button>
      </div>

      {attempts.length === 0 ? (
        <div className="aop-empty">
          <BarChart2 size={48} color="#ccc" />
          <p>Complete mock tests to see your performance analysis here.</p>
          <button className="btn-new-test" onClick={() => navigate('/dashboard/mock-test/setup/select')}>
            Start Your First Test
          </button>
        </div>
      ) : (
        <div className="aop-list">
          {attempts.map(a => {
            const pct = parseFloat(a.accuracy) || 0;
            return (
              <div key={a.attemptId} className="aop-card">
                <div className="aop-card-top">
                  <span className="aop-exam">{a.examName}</span>
                  <span className={`aop-acc-badge${pct >= 75 ? ' high' : pct >= 50 ? ' mid' : ' low'}`}>
                    {pct}% Accuracy
                  </span>
                </div>
                <div className="aop-bar-wrap">
                  <div className={`aop-bar${pct >= 75 ? ' high' : pct >= 50 ? ' mid' : ' low'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="aop-stats">
                  <span>Score: <b>{a.score}</b></span>
                  <span>Correct: <b>{a.correct}</b></span>
                  <span>Wrong: <b>{a.wrong}</b></span>
                  <span>Unanswered: <b>{a.unanswered}</b></span>
                </div>
                <button className="aop-detail-btn" onClick={() => navigate(`/dashboard/mock-test/analysis/${a.attemptId}`)}>
                  View Detailed Analysis
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
