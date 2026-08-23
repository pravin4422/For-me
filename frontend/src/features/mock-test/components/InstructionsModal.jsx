import './InstructionsModal.css';

export default function InstructionsModal({ examConfig, agreed, onAgree, onStart, onClose }) {
  if (!examConfig) return null;
  const { name, totalQuestions, durationMinutes, markingScheme, sections, instructions } = examConfig;

  return (
    <div className="modal-overlay">
      <div className="instructions-modal">
        <div className="im-header">
          <h2>{name} — General Instructions</h2>
          <button className="im-close" onClick={onClose}>✕</button>
        </div>

        <div className="im-body">
          <div className="im-meta">
            <span><b>Total Questions:</b> {totalQuestions}</span>
            <span><b>Duration:</b> {durationMinutes} minutes</span>
            <span><b>Marking:</b> +{markingScheme.positive} / −{markingScheme.negative}</span>
          </div>

          {sections?.length > 0 && (
            <div className="im-sections">
              <b>Sections:</b>
              <table className="im-table">
                <thead><tr><th>Section</th><th>Questions</th><th>Marks</th></tr></thead>
                <tbody>
                  {sections.map(s => (
                    <tr key={s.id}><td>{s.name}</td><td>{s.questionCount}</td><td>{s.questionCount * markingScheme.positive}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="im-rules">
            <p><b>Navigation Instructions:</b></p>
            <ul>
              <li>Click a question number in the palette to jump directly to it.</li>
              <li>Use <b>Save &amp; Next</b> to save your answer and move to the next question.</li>
              <li>Use <b>Mark for Review &amp; Next</b> to flag a question and move on.</li>
              <li>Use <b>Clear Response</b> to deselect your answer.</li>
              <li>The test will auto-submit when the timer reaches 00:00:00.</li>
            </ul>
            <p><b>Marking Scheme:</b></p>
            <ul>
              <li>Each correct answer: <b>+{markingScheme.positive}</b> mark(s).</li>
              <li>Each wrong answer: <b>−{markingScheme.negative}</b> mark(s).</li>
              <li>Unanswered questions: <b>0</b> marks.</li>
            </ul>
            {instructions?.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </div>

        <div className="im-footer">
          <label className="im-agree">
            <input type="checkbox" checked={agreed} onChange={e => onAgree(e.target.checked)} />
            I have read and understood all the instructions. I agree to abide by them.
          </label>
          <button className="btn-start-test" disabled={!agreed} onClick={onStart}>
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
