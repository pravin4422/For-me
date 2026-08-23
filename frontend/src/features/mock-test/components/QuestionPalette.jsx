import { Q_STATUS } from '../hooks/useMockTest';
import './QuestionPalette.css';

const STATUS_LABEL = {
  [Q_STATUS.NOT_VISITED]:     'Not Visited',
  [Q_STATUS.NOT_ANSWERED]:    'Not Answered',
  [Q_STATUS.ANSWERED]:        'Answered',
  [Q_STATUS.MARKED]:          'Marked for Review',
  [Q_STATUS.ANSWERED_MARKED]: 'Answered & Marked',
};

export default function QuestionPalette({ questions, statuses, currentIdx, onJump, counts }) {
  return (
    <div className="qpalette">
      <div className="qpalette-legend">
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <div key={key} className="legend-item">
            <span className={`legend-dot status-${key}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="qpalette-counts">
        <span className="pc-item"><b>{counts.answered}</b> Answered</span>
        <span className="pc-item"><b>{counts.notAnswered}</b> Not Answered</span>
        <span className="pc-item"><b>{counts.marked}</b> Marked</span>
        <span className="pc-item"><b>{counts.notVisited}</b> Not Visited</span>
      </div>
      <div className="qpalette-grid">
        {questions.map((q, idx) => (
          <button
            key={q._id}
            className={`qnum status-${statuses[q._id] || Q_STATUS.NOT_VISITED}${idx === currentIdx ? ' current' : ''}`}
            onClick={() => onJump(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
