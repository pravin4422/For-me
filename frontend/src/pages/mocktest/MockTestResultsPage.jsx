import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResult } from '../../api/mocktest';
import ResultSummaryCard from '../../features/mock-test/components/ResultSummaryCard';
import './MockTestResultsPage.css';

// Reads all cached attempt results from sessionStorage
function getAllCachedResults() {
  const results = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.startsWith('result_')) {
      const attemptId = key.replace('result_', '');
      const meta      = JSON.parse(sessionStorage.getItem(`attempt_${attemptId}`) || '{}');
      const result    = JSON.parse(sessionStorage.getItem(key));
      results.push({ attemptId, examName: meta.name || 'Mock Test', ...result });
    }
  }
  return results.reverse();
}

export default function MockTestResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(getAllCachedResults());
  }, []);

  return (
    <div className="results-page">
      <div className="results-header">
        <h2>Past Results</h2>
        <button className="btn-new-test" onClick={() => navigate('/dashboard/mock-test/setup/select')}>
          Start New Test
        </button>
      </div>

      {results.length === 0 ? (
        <div className="results-empty">
          <p>No test results yet. Complete a mock test to see your results here.</p>
          <button className="btn-new-test" onClick={() => navigate('/dashboard/mock-test/setup/select')}>
            Start Your First Test
          </button>
        </div>
      ) : (
        <div className="results-list">
          {results.map(r => (
            <div key={r.attemptId} className="result-row">
              <div className="rr-meta">
                <span className="rr-exam">{r.examName}</span>
                <span className="rr-score">Score: <b>{r.score}</b></span>
                <span className="rr-acc">Accuracy: <b>{r.accuracy}%</b></span>
                <span className="rr-correct">Correct: <b>{r.correct}</b></span>
                <span className="rr-wrong">Wrong: <b>{r.wrong}</b></span>
              </div>
              <div className="rr-actions">
                <button onClick={() => navigate(`/dashboard/mock-test/result/${r.attemptId}`)}>View Result</button>
                <button onClick={() => navigate(`/dashboard/mock-test/analysis/${r.attemptId}`)}>Analysis</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
