import { BarChart2 } from 'lucide-react';

export default function CutoffChart({ cutoffs = [] }) {
  if (!cutoffs.length) {
    return (
      <div className="cutoff-chart cutoff-chart--empty">
        <BarChart2 size={32} />
        <p>No cutoff data available.</p>
      </div>
    );
  }

  const max = Math.max(...cutoffs.map(c => c.value));

  return (
    <div className="cutoff-chart">
      {cutoffs.map((c, i) => (
        <div key={i} className="cutoff-chart__row">
          <span className="cutoff-chart__label">{c.label}</span>
          <div className="cutoff-chart__bar-wrap">
            <div
              className="cutoff-chart__bar"
              style={{ width: `${(c.value / max) * 100}%` }}
            />
          </div>
          <span className="cutoff-chart__value">{c.value}</span>
        </div>
      ))}
    </div>
  );
}
