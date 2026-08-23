import { CheckCircle, XCircle } from 'lucide-react';

export default function PracticeQuestionCard({ question, index, answer, onChange, submitted }) {
  const { id, question: q, isCorrect, userAnswer } = question;

  return (
    <div className={`pq-card ${submitted ? (isCorrect ? 'correct' : 'wrong') : ''}`}>
      <span className="pq-card__num">{index + 1}.</span>
      <div className="pq-card__body">
        <p className="pq-card__question">{q}</p>
        <input
          className="pq-card__input"
          type="text"
          value={submitted ? userAnswer : (answer ?? '')}
          onChange={e => !submitted && onChange(id, e.target.value)}
          disabled={submitted}
          placeholder="Your answer"
        />
        {submitted && (
          <span className="pq-card__feedback">
            {isCorrect
              ? <><CheckCircle size={14} /> Correct</>
              : <><XCircle size={14} /> Answer: {question.answer}</>}
          </span>
        )}
      </div>
    </div>
  );
}
