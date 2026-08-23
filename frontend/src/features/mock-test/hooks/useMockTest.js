import { useState, useCallback } from 'react';
import { fetchQuestions } from '../../../api/mocktest';

// Status constants matching real exam portals
export const Q_STATUS = {
  NOT_VISITED:              'not-visited',
  NOT_ANSWERED:             'not-answered',
  ANSWERED:                 'answered',
  MARKED:                   'marked',
  ANSWERED_MARKED:          'answered-marked',
};

export default function useMockTest() {
  const [questions, setQuestions]     = useState([]);
  const [answers, setAnswers]         = useState({});   // { qId: optionIndex }
  const [statuses, setStatuses]       = useState({});   // { qId: Q_STATUS }
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const loadQuestions = useCallback(async (attemptId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchQuestions(attemptId);
      setQuestions(data);
      const init = {};
      data.forEach(q => { init[q._id] = Q_STATUS.NOT_VISITED; });
      setStatuses(init);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const goTo = useCallback((idx) => {
    setCurrentIdx(idx);
    setStatuses(prev => {
      const qId = questions[idx]?._id;
      if (!qId) return prev;
      if (prev[qId] === Q_STATUS.NOT_VISITED) return { ...prev, [qId]: Q_STATUS.NOT_ANSWERED };
      return prev;
    });
  }, [questions]);

  const saveAnswer = useCallback((qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setStatuses(prev => ({
      ...prev,
      [qId]: prev[qId] === Q_STATUS.MARKED || prev[qId] === Q_STATUS.ANSWERED_MARKED
        ? Q_STATUS.ANSWERED_MARKED
        : Q_STATUS.ANSWERED,
    }));
  }, []);

  const clearAnswer = useCallback((qId) => {
    setAnswers(prev => { const n = { ...prev }; delete n[qId]; return n; });
    setStatuses(prev => ({ ...prev, [qId]: Q_STATUS.NOT_ANSWERED }));
  }, []);

  const markForReview = useCallback((qId) => {
    setStatuses(prev => ({
      ...prev,
      [qId]: answers[qId] !== undefined ? Q_STATUS.ANSWERED_MARKED : Q_STATUS.MARKED,
    }));
  }, [answers]);

  const saveAndNext = useCallback((qId, optionIdx) => {
    if (optionIdx !== undefined) saveAnswer(qId, optionIdx);
    else setStatuses(prev => ({
      ...prev,
      [qId]: prev[qId] === Q_STATUS.NOT_VISITED ? Q_STATUS.NOT_ANSWERED : prev[qId],
    }));
    setCurrentIdx(i => Math.min(i + 1, questions.length - 1));
  }, [saveAnswer, questions.length]);

  const markAndNext = useCallback((qId, optionIdx) => {
    markForReview(qId);
    if (optionIdx !== undefined) saveAnswer(qId, optionIdx);
    setCurrentIdx(i => Math.min(i + 1, questions.length - 1));
  }, [markForReview, saveAnswer, questions.length]);

  const counts = {
    answered:       Object.values(statuses).filter(s => s === Q_STATUS.ANSWERED || s === Q_STATUS.ANSWERED_MARKED).length,
    notAnswered:    Object.values(statuses).filter(s => s === Q_STATUS.NOT_ANSWERED).length,
    marked:         Object.values(statuses).filter(s => s === Q_STATUS.MARKED).length,
    answeredMarked: Object.values(statuses).filter(s => s === Q_STATUS.ANSWERED_MARKED).length,
    notVisited:     Object.values(statuses).filter(s => s === Q_STATUS.NOT_VISITED).length,
  };

  return {
    questions, answers, statuses, currentIdx,
    loading, error,
    loadQuestions, goTo, saveAnswer, clearAnswer,
    markForReview, saveAndNext, markAndNext, counts,
  };
}
