import PracticeQuestionCard from './PracticeQuestionCard';
import ScoreSummary from './ScoreSummary';

export default function PracticeSection({ hook }) {
  const { questions, answers, submitted, score, start, setAnswer, submit, reset } = hook;

  if (!questions.length) {
    return (
      <div className="practice-section practice-section--empty">
        <p>Ready to test yourself?</p>
        <button className="sm-btn sm-btn--primary" onClick={start}>Start Practice</button>
      </div>
    );
  }

  return (
    <div className="practice-section">
      <div className="practice-section__questions">
        {questions.map((q, i) => (
          <PracticeQuestionCard
            key={q.id}
            question={q}
            index={i}
            answer={answers[q.id]}
            onChange={setAnswer}
            submitted={submitted}
          />
        ))}
      </div>

      {!submitted ? (
        <button className="sm-btn sm-btn--primary" onClick={submit}>Submit Answers</button>
      ) : (
        <ScoreSummary score={score} onRetry={reset} />
      )}
    </div>
  );
}
