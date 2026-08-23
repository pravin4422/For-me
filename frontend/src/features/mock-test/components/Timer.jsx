import './Timer.css';

export default function Timer({ display, isWarning }) {
  return (
    <div className={`exam-timer${isWarning ? ' warning' : ''}`}>
      <span className="timer-label">Time Left</span>
      <span className="timer-display">{display}</span>
    </div>
  );
}
