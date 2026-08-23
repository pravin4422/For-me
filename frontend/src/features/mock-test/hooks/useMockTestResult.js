import { useState, useCallback } from 'react';
import { submitAttempt, fetchResult, fetchAnalysis } from '../../../api/mocktest';

export default function useMockTestResult() {
  const [result,   setResult]   = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const submit = useCallback(async (attemptId, answers, markingScheme, questions) => {
    setLoading(true);
    setError(null);
    try {
      await submitAttempt(attemptId, answers);
      const { data } = await fetchResult(attemptId);
      // Client-side score calculation as fallback / display
      if (!data.score && markingScheme && questions) {
        let correct = 0, wrong = 0, unanswered = 0;
        questions.forEach(q => {
          const ans = answers[q._id];
          if (ans === undefined || ans === null) { unanswered++; }
          else if (ans === q.correctOption)      { correct++; }
          else                                   { wrong++; }
        });
        const score = (correct * markingScheme.positive) - (wrong * markingScheme.negative);
        data.correct    = correct;
        data.wrong      = wrong;
        data.unanswered = unanswered;
        data.score      = score;
        data.accuracy   = questions.length ? ((correct / questions.length) * 100).toFixed(1) : 0;
      }
      setResult(data);
      return data;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalysis = useCallback(async (attemptId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchAnalysis(attemptId);
      setAnalysis(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, analysis, loading, error, submit, loadAnalysis };
}
