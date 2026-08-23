import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useMockTestResult from './hooks/useMockTestResult';
import WeakTopicList from './components/WeakTopicList';
import './MockTestAnalysisScreen.css';

export default function MockTestAnalysisScreen() {
  const { attemptId } = useParams();
  const navigate      = useNavigate();
  const { analysis, loadAnalysis, loading } = useMockTestResult();
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => { loadAnalysis(attemptId); }, [attemptId, loadAnalysis]);

  if (loading) return <div className="analysis-loading">Loading analysis...</div>;
  if (!analysis) return null;

  const { questions = [], weakTopics = [], examId } = analysis;
  const q = questions[reviewIdx];

  return (
    <div className="analysis-page">
      <div className="analysis-content">
        <div className="analysis-header">
          <h2>Detailed Analysis</h2>
          <button className="btn-back-result" onClick={() => navigate(`/dashboard/mock-test/result/${attemptId}`)}>
            Back to Result
          </button>
        </div>

        {/* Question-by-question review */}
        <div className="analysis-section">
          <h4>Question Review ({reviewIdx + 1} / {questions.length})</h4>
          {q && (
            <div className="qreview-card">
              <p className="qr-text">{q.text}</p>
              <div className="qr-options">
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`qr-opt
                      ${idx === q.correctOption ? 'correct-opt' : ''}
                      ${idx === q.yourAnswer && idx !== q.correctOption ? 'wrong-opt' : ''}
                    `}
                  >
                    <span className="opt-label">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                    {idx === q.correctOption && <span className="tag correct-tag">Correct</span>}
                    {idx === q.yourAnswer && idx !== q.correctOption && <span className="tag wrong-tag">Your Answer</span>}
                    {idx === q.yourAnswer && idx === q.correctOption && <span className="tag your-correct-tag">Your Answer</span>}
                  </div>
                ))}
              </div>
              {q.explanation && (
                <div className="qr-explanation">
                  <b>Explanation:</b> {q.explanation}
                </div>
              )}
              <div className="qr-nav">
                <button disabled={reviewIdx === 0} onClick={() => setReviewIdx(i => i - 1)}>Prev</button>
                <span>{reviewIdx + 1} / {questions.length}</span>
                <button disabled={reviewIdx === questions.length - 1} onClick={() => setReviewIdx(i => i + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Weak Topic Detection */}
        <div className="analysis-section">
          <WeakTopicList topics={weakTopics} examId={examId} />
        </div>

        {/* Revision Recommendation */}
        {weakTopics.filter(t => t.accuracy < 50).length > 0 && (
          <div className="analysis-section revision-box">
            <h4>Revision Recommendations</h4>
            <ul>
              {weakTopics.filter(t => t.accuracy < 50).map(t => (
                <li key={t.topicId}>
                  Revise <b>{t.topicName}</b> — only {t.accuracy}% accuracy. Focus on concept clarity and practice more questions.
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
