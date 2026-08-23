import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useMockTest from './hooks/useMockTest';
import useMockTestTimer from './hooks/useMockTestTimer';
import QuestionCard from './components/QuestionCard';
import QuestionPalette from './components/QuestionPalette';
import SectionTabs from './components/SectionTabs';
import Timer from './components/Timer';
import SubmitConfirmModal from './components/SubmitConfirmModal';
import { submitAttempt, fetchResult } from '../../api/mocktest';
import './MockTestExamScreen.css';

export default function MockTestExamScreen() {
  const { attemptId } = useParams();
  const navigate      = useNavigate();
  const submittingRef = useRef(false);

  const {
    questions, answers, statuses, currentIdx,
    loading, loadQuestions, goTo,
    clearAnswer, saveAndNext, markAndNext, counts,
  } = useMockTest();

  const [examMeta,      setExamMeta]      = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [localOption,   setLocalOption]   = useState(undefined);
  const [submitting,    setSubmitting]     = useState(false);

  useEffect(() => {
    loadQuestions(attemptId);
    const meta = JSON.parse(sessionStorage.getItem(`attempt_${attemptId}`) || 'null');
    if (meta) {
      setExamMeta(meta);
      setActiveSection(meta.sections?.[0]?.id || null);
    }
  }, [attemptId, loadQuestions]);

  useEffect(() => {
    const q = questions[currentIdx];
    setLocalOption(q ? answers[q._id] : undefined);
  }, [currentIdx, questions, answers]);

  const doSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await submitAttempt(attemptId, answers);
      // Calculate result client-side and cache it
      const ms = examMeta?.markingScheme || { positive: 1, negative: 0.33 };
      let correct = 0, wrong = 0, unanswered = 0;
      questions.forEach(q => {
        const ans = answers[q._id];
        if (ans === undefined || ans === null) unanswered++;
        else if (ans === q.correctOption)      correct++;
        else                                   wrong++;
      });
      const score    = (correct * ms.positive) - (wrong * ms.negative);
      const accuracy = questions.length ? ((correct / questions.length) * 100).toFixed(1) : '0.0';
      const result   = {
        totalQuestions: questions.length, correct, wrong, unanswered,
        score: parseFloat(score.toFixed(2)), accuracy,
        timeTaken: 'Submitted',
        sectionBreakdown: examMeta?.sections?.map(s => {
          const sqs = questions.filter(q => q.sectionId === s.id);
          const sc  = sqs.filter(q => answers[q._id] === q.correctOption).length;
          return { name: s.name, score: sc * ms.positive, maxScore: sqs.length * ms.positive };
        }) || [],
      };
      sessionStorage.setItem(`result_${attemptId}`, JSON.stringify(result));
      navigate(`/dashboard/mock-test/result/${attemptId}`);
    } catch {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [attemptId, answers, examMeta, questions, navigate]);

  const { display, isWarning, start } = useMockTestTimer(
    examMeta?.durationSeconds || 0,
    doSubmit,
  );

  useEffect(() => {
    if (examMeta?.durationSeconds) start();
  }, [examMeta, start]);

  const visibleQuestions = activeSection
    ? questions.filter(q => q.sectionId === activeSection)
    : questions;

  const currentQ  = visibleQuestions[currentIdx];
  const sections  = examMeta?.sections || [];

  if (loading) return <div className="exam-loading">Loading questions...</div>;
  if (!questions.length) return <div className="exam-loading">No questions found.</div>;

  return (
    <div className="exam-screen">
      <div className="exam-topbar">
        <span className="exam-name">{examMeta?.name || 'Mock Test'}</span>
        <Timer display={display} isWarning={isWarning} />
        <button className="btn-submit-test" onClick={() => setShowConfirm(true)} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>

      {sections.length > 0 && (
        <SectionTabs
          sections={sections}
          activeSection={activeSection}
          onSwitch={id => { setActiveSection(id); goTo(0); }}
        />
      )}

      <div className="exam-body">
        <div className="exam-main">
          {currentQ ? (
            <QuestionCard
              question={currentQ}
              questionNumber={currentIdx + 1}
              totalQuestions={visibleQuestions.length}
              selectedOption={localOption}
              onSelect={setLocalOption}
              onSaveNext={(opt) => saveAndNext(currentQ._id, opt ?? localOption)}
              onClear={() => { clearAnswer(currentQ._id); setLocalOption(undefined); }}
              onMarkNext={(opt) => markAndNext(currentQ._id, opt ?? localOption)}
              onNext={() => goTo(Math.min(currentIdx + 1, visibleQuestions.length - 1))}
            />
          ) : (
            <div className="exam-loading">Select a section to view questions.</div>
          )}
        </div>

        <div className="exam-sidebar">
          <QuestionPalette
            questions={visibleQuestions}
            statuses={statuses}
            currentIdx={currentIdx}
            onJump={goTo}
            counts={counts}
          />
        </div>
      </div>

      {showConfirm && (
        <SubmitConfirmModal
          counts={counts}
          onConfirm={() => { setShowConfirm(false); doSubmit(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
