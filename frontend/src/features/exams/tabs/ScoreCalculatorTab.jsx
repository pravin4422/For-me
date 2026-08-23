import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function ScoreCalculatorTab({ data, loading }) {
  const [correct,   setCorrect]   = useState('');
  const [incorrect, setIncorrect] = useState('');
  const [result,    setResult]    = useState(null);

  const marking = data?.overview?.marking ?? { correct: 1, wrong: 0.25 };

  const calculate = () => {
    const c = parseFloat(correct)   || 0;
    const w = parseFloat(incorrect) || 0;
    setResult((c * marking.correct) - (w * marking.wrong));
  };

  if (loading) return <div className="tab-loading">Loading...</div>;

  return (
    <div className="tab-section">
      <div className="tab-section__header"><Calculator size={16} /><h3>Score Calculator</h3></div>
      <div className="tab-section__body score-calc">
        <p className="score-calc__scheme">
          Marking: +{marking.correct} correct / -{marking.wrong} wrong
        </p>
        <div className="score-calc__row">
          <label>Correct Answers
            <input type="number" min="0" value={correct} onChange={e => setCorrect(e.target.value)} className="exam-input" />
          </label>
          <label>Wrong Answers
            <input type="number" min="0" value={incorrect} onChange={e => setIncorrect(e.target.value)} className="exam-input" />
          </label>
        </div>
        <button className="btn-primary" onClick={calculate}>Calculate</button>
        {result !== null && (
          <div className="score-calc__result">Estimated Score: <strong>{result.toFixed(2)}</strong></div>
        )}
      </div>
    </div>
  );
}
