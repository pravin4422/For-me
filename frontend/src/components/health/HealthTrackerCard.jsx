import './HealthTrackerCard.css';

export default function HealthTrackerCard({
  icon, iconColor, label, value, goal, pct, ringColor, isEmpty, children
}) {
  const r = 30, cx = 38, cy = 38, stroke = 5;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const pctLabel = Math.round(pct * 100);

  return (
    <div className="htc">
      <div className="htc-top">
        <div className="htc-ring-wrap">
          <svg width="76" height="76">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={ringColor} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`} />
          </svg>
          <span className="htc-ring-pct" style={{ color: ringColor }}>{pctLabel}%</span>
        </div>

        <div className="htc-meta">
          <div className="htc-label-row">
            <span className="htc-icon" style={{ color: iconColor, background: `${iconColor}18` }}>{icon}</span>
            <span className="htc-label">{label}</span>
          </div>
          {isEmpty ? (
            <p className="htc-empty">No data logged yet today</p>
          ) : (
            <>
              <p className="htc-value">{value}</p>
              <p className="htc-goal">Goal: {goal}</p>
            </>
          )}
        </div>
      </div>

      <div className="htc-actions">{children}</div>
    </div>
  );
}
