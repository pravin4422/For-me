import { useState, useEffect, useCallback } from 'react';

export default function useExamDocuments(examId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetchDocuments = useCallback(() => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    // TODO: axiosInstance.get(`/exams/${examId}/documents`)
    setTimeout(() => {
      setDocuments([]);
      setLoading(false);
    }, 400);
  }, [examId]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const uploadDocument = useCallback(async (file) => {
    // TODO: axiosInstance.post(`/exams/${examId}/documents`, formData)
    const doc = { id: Date.now(), name: file.name, type: file.type, url: URL.createObjectURL(file), size: file.size };
    setDocuments(prev => [...prev, doc]);
    return doc;
  }, [examId]);

  const deleteDocument = useCallback((docId) => {
    // TODO: axiosInstance.delete(`/exams/${examId}/documents/${docId}`)
    setDocuments(prev => prev.filter(d => d.id !== docId));
  }, [examId]);

  return { documents, loading, error, uploadDocument, deleteDocument, refetch: fetchDocuments };
}
