import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchResult } from '../../api/mocktest';
import ResultSummaryCard from './components/ResultSummaryCard';
import ScoreBreakdownChart from './components/ScoreBreakdownChart';
import './MockTestResultScreen.css';

export default function MockTestResultScreen() {
  const { attemptId } = useParams();
  const navigate      = useNavigate();
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult(attemptId)
      .then(r => setResult(r.data))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <div className="result-loading">Loading result...</div>;

  return (
    <div className="result-page">
      <div className="result-content">
        <h2 className="result-heading">Test Completed</h2>

        <ResultSummaryCard result={result} />

        {result?.sectionBreakdown?.length > 0 && (
          <ScoreBreakdownChart breakdown={result.sectionBreakdown} />
        )}

        <div className="result-actions">
          <button className="btn-analysis"  onClick={() => navigate(`/dashboard/mock-test/analysis/${attemptId}`)}>
            View Detailed Analysis
          </button>
          <button className="btn-retake"    onClick={() => navigate('/dashboard/mock-test')}>
            Retake / New Test
          </button>
          <button className="btn-dashboard" onClick={() => navigate('/dashboard/mock-test')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
