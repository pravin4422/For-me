import './ScoreBreakdownChart.css';

export default function ScoreBreakdownChart({ breakdown }) {
  if (!breakdown?.length) return null;

  const max = Math.max(...breakdown.map(b => b.maxScore), 1);

  return (
    <div className="score-breakdown">
      <h4 className="sbc-title">Section-wise Score</h4>
      <div className="sbc-bars">
        {breakdown.map(sec => {
          const pct = Math.round((sec.score / sec.maxScore) * 100);
          return (
            <div key={sec.name} className="sbc-row">
              <span className="sbc-name">{sec.name}</span>
              <div className="sbc-bar-wrap">
                <div
                  className={`sbc-bar${pct < 40 ? ' low' : pct < 70 ? ' mid' : ' high'}`}
                  style={{ width: `${(sec.score / max) * 100}%` }}
                />
              </div>
              <span className="sbc-score">{sec.score}/{sec.maxScore} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
