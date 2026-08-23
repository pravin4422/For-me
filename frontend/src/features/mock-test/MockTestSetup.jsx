import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchExams, fetchSubjects, fetchTopics, fetchExamConfig, startAttempt } from '../../api/mocktest';
import InstructionsModal from './components/InstructionsModal';
import './MockTestSetup.css';

export default function MockTestSetup() {
  const { examId: paramExamId } = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefilled = location.state?.prefilledTopic;

  const [exams,     setExams]     = useState([]);
  const [subjects,  setSubjects]  = useState([]);
  const [topics,    setTopics]    = useState([]);
  const [examConfig, setExamConfig] = useState(null);

  // 'select' is the placeholder route from the dashboard card — treat as empty
  const [selectedExam,    setSelectedExam]    = useState(paramExamId && paramExamId !== 'select' ? paramExamId : '');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic,   setSelectedTopic]   = useState(prefilled?.topicId || '');
  const [fullExam,        setFullExam]        = useState(!prefilled);

  const [showModal, setShowModal] = useState(false);
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    fetchExams().then(r => setExams(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedExam) return;
    fetchSubjects(selectedExam).then(r => setSubjects(r.data)).catch(() => {});
    fetchExamConfig(selectedExam).then(r => setExamConfig(r.data)).catch(() => {});
    setSelectedSubject('');
    setSelectedTopic('');
  }, [selectedExam]);

  useEffect(() => {
    if (!selectedExam || !selectedSubject) return;
    fetchTopics(selectedExam, selectedSubject).then(r => setTopics(r.data)).catch(() => {});
    setSelectedTopic('');
  }, [selectedExam, selectedSubject]);

  const canStart = selectedExam && (fullExam || selectedTopic);

  const handleStartClick = () => {
    if (!canStart) return;
    setShowModal(true);
    setAgreed(false);
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const payload = {
        examId:    selectedExam,
        subjectId: selectedSubject || null,
        topicId:   fullExam ? null : selectedTopic,
        fullExam,
      };
      const { data } = await startAttempt(payload);
      navigate(`/dashboard/mock-test/exam/${data.attemptId}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h2 className="setup-title">Start Mock Test</h2>

        <div className="setup-field">
          <label>Select Exam</label>
          <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
            <option value="">-- Select Exam --</option>
            {exams.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
        </div>

        {selectedExam && (
          <div className="setup-field">
            <label>Select Subject <span className="optional">(optional)</span></label>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
              <option value="">-- All Subjects --</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        )}

        {selectedExam && (
          <div className="setup-field">
            <label>Test Type</label>
            <div className="radio-group">
              <label className="radio-opt">
                <input type="radio" checked={fullExam} onChange={() => setFullExam(true)} />
                Full Exam
              </label>
              <label className="radio-opt">
                <input type="radio" checked={!fullExam} onChange={() => setFullExam(false)} />
                Topic-Specific
              </label>
            </div>
          </div>
        )}

        {!fullExam && selectedSubject && (
          <div className="setup-field">
            <label>Select Topic</label>
            <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
              <option value="">-- Select Topic --</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
        )}

        {examConfig && (
          <div className="setup-info-box">
            <div className="sib-item"><span>Questions</span><b>{examConfig.totalQuestions}</b></div>
            <div className="sib-item"><span>Duration</span><b>{examConfig.durationMinutes} min</b></div>
            <div className="sib-item"><span>Correct</span><b>+{examConfig.markingScheme.positive}</b></div>
            <div className="sib-item"><span>Wrong</span><b>−{examConfig.markingScheme.negative}</b></div>
          </div>
        )}

        <button className="btn-proceed" disabled={!canStart} onClick={handleStartClick}>
          Proceed to Instructions
        </button>
      </div>

      {showModal && examConfig && (
        <InstructionsModal
          examConfig={examConfig}
          agreed={agreed}
          onAgree={setAgreed}
          onStart={handleStart}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
