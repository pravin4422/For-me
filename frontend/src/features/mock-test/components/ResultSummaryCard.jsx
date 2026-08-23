import './ResultSummaryCard.css';

export default function ResultSummaryCard({ result }) {
  if (!result) return null;
  const items = [
    { label: 'Total Questions', value: result.totalQuestions, cls: '' },
    { label: 'Correct',         value: result.correct,        cls: 'correct' },
    { label: 'Wrong',           value: result.wrong,          cls: 'wrong' },
    { label: 'Unanswered',      value: result.unanswered,     cls: 'unanswered' },
    { label: 'Score',           value: result.score?.toFixed(2), cls: 'score' },
    { label: 'Accuracy',        value: `${result.accuracy}%`, cls: 'accuracy' },
    { label: 'Time Taken',      value: result.timeTaken,      cls: '' },
    ...(result.rank ? [{ label: 'Rank', value: `#${result.rank}`, cls: 'rank' }] : []),
  ];

  return (
    <div className="result-summary-card">
      <h3 className="rsc-title">Your Result</h3>
      <div className="rsc-grid">
        {items.map(item => (
          <div key={item.label} className={`rsc-item ${item.cls}`}>
            <span className="rsc-value">{item.value ?? '—'}</span>
            <span className="rsc-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
