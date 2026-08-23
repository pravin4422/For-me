import './QuestionCard.css';

export default function QuestionCard({
  question, questionNumber, totalQuestions,
  selectedOption, onSelect,
  onSaveNext, onClear, onMarkNext, onNext,
}) {
  if (!question) return null;

  return (
    <div className="qcard">
      <div className="qcard-header">
        <span className="qcard-num">Question {questionNumber} of {totalQuestions}</span>
        {question.section && <span className="qcard-section">{question.section}</span>}
        {question.topic   && <span className="qcard-topic">{question.topic}</span>}
      </div>

      <div className="qcard-body">
        <p className="qcard-text">{question.text}</p>
        {question.image && <img src={question.image} alt="question" className="qcard-img" />}

        <div className="qcard-options">
          {question.options.map((opt, idx) => (
            <label key={idx} className={`qcard-option${selectedOption === idx ? ' selected' : ''}`}>
              <input
                type="radio"
                name={`q-${question._id}`}
                checked={selectedOption === idx}
                onChange={() => onSelect(idx)}
              />
              <span className="opt-label">{String.fromCharCode(65 + idx)}.</span>
              <span className="opt-text">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="qcard-actions">
        <button className="btn-save-next"   onClick={() => onSaveNext(selectedOption)}>Save &amp; Next</button>
        <button className="btn-mark-next"   onClick={() => onMarkNext(selectedOption)}>Mark for Review &amp; Next</button>
        <button className="btn-clear"       onClick={onClear}>Clear Response</button>
        <button className="btn-next"        onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
