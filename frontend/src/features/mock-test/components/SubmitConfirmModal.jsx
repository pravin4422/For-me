import './SubmitConfirmModal.css';

export default function SubmitConfirmModal({ counts, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="submit-modal">
        <h3>Submit Test?</h3>
        <p>Please review your attempt summary before submitting.</p>
        <div className="submit-stats">
          <div className="ss-item answered"><span>{counts.answered}</span><label>Answered</label></div>
          <div className="ss-item not-answered"><span>{counts.notAnswered}</span><label>Not Answered</label></div>
          <div className="ss-item marked"><span>{counts.marked}</span><label>Marked</label></div>
          <div className="ss-item not-visited"><span>{counts.notVisited}</span><label>Not Visited</label></div>
        </div>
        <p className="submit-warn">Once submitted, you cannot change your answers.</p>
        <div className="submit-actions">
          <button className="btn-cancel-submit" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-submit" onClick={onConfirm}>Submit Test</button>
        </div>
      </div>
    </div>
  );
}
