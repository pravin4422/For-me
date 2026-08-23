import { useState, useEffect } from 'react';

export function useTopics(subjectId = null) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // replace with: api/study/topics.js → getTopics(subjectId)
    setLoading(false);
    setTopics([]);
  }, [subjectId]);

  const addTopic    = (topic) => setTopics(p => [...p, { id: Date.now(), subjectId, ...topic }]);
  const updateTopic = (id, data) => setTopics(p => p.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTopic = (id) => setTopics(p => p.filter(t => t.id !== id));

  return { topics, loading, error, addTopic, updateTopic, deleteTopic };
}
