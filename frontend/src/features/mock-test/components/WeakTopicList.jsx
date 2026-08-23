import { useNavigate } from 'react-router-dom';
import './WeakTopicList.css';

export default function WeakTopicList({ topics, examId }) {
  const navigate = useNavigate();
  if (!topics?.length) return <p className="no-weak">No weak topics detected. Great performance!</p>;

  const sorted = [...topics].sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="weak-topic-list">
      <h4 className="wtl-title">Weak Topic Detection</h4>
      <table className="wtl-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Attempted</th>
            <th>Correct</th>
            <th>Accuracy</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => (
            <tr key={t.topicId} className={t.accuracy < 50 ? 'weak-row' : ''}>
              <td>{t.topicName}</td>
              <td>{t.attempted}</td>
              <td>{t.correct}</td>
              <td>
                <span className={`acc-badge${t.accuracy < 50 ? ' low' : t.accuracy < 75 ? ' mid' : ' high'}`}>
                  {t.accuracy}%
                </span>
              </td>
              <td>{t.accuracy < 50 ? <span className="weak-flag">Weak</span> : <span className="ok-flag">OK</span>}</td>
              <td>
                {t.accuracy < 75 && (
                  <button
                    className="btn-topic-test"
                    onClick={() => navigate(`/dashboard/mock-test/setup/${examId}`, { state: { prefilledTopic: t } })}
                  >
                    Practice Topic
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
