import { useState, useEffect } from 'react';

export default function useExamData(examId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    // TODO: replace with axiosInstance call
    // axiosInstance.get(`/exams/${examId}`)
    const timer = setTimeout(() => {
      setData({
        id: examId,
        name: examId,
        overview: {},
        syllabus: [],
        cutoffs: [],
        topics: [],
        planner: [],
        mockTests: [],
      });
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [examId]);

  return { data, loading, error };
}
