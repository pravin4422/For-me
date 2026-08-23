import { Trophy, RotateCcw } from 'lucide-react';

export default function ScoreSummary({ score, onRetry }) {
  const { correct, total, percent } = score;
  const grade = percent >= 80 ? 'Excellent' : percent >= 60 ? 'Good' : percent >= 40 ? 'Fair' : 'Keep Practicing';

  return (
    <div className="score-summary">
      <Trophy size={32} className="score-summary__icon" />
      <h3 className="score-summary__grade">{grade}</h3>
      <p className="score-summary__stat">{correct} / {total} correct ({percent}%)</p>
      <button className="score-summary__retry" onClick={onRetry}>
        <RotateCcw size={14} /> Try Again
      </button>
    </div>
  );
}
