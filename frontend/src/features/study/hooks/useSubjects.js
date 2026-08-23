import { useState, useEffect } from 'react';

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    // replace with: api/study/subjects.js → getSubjects()
    setLoading(false);
    setSubjects([]);
  }, []);

  const addSubject    = (subject) => setSubjects(p => [...p, { id: Date.now(), ...subject }]);
  const updateSubject = (id, data) => setSubjects(p => p.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteSubject = (id) => setSubjects(p => p.filter(s => s.id !== id));

  return { subjects, loading, error, addSubject, updateSubject, deleteSubject };
}
