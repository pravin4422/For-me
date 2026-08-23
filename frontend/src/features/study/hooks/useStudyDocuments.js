import { useState } from 'react';

export function useStudyDocuments(ownerId) {
  const [docs, setDocs] = useState([]);

  const uploadDoc = (file) => {
    const doc = {
      id:         Date.now(),
      ownerId,
      name:       file.name,
      type:       file.type,
      size:       file.size,
      url:        URL.createObjectURL(file),
      frequent:   false,
      uploadedAt: new Date().toISOString(),
    };
    setDocs(p => [...p, doc]);
    return doc;
  };

  const toggleFrequent = (id) =>
    setDocs(p => p.map(d => d.id === id ? { ...d, frequent: !d.frequent } : d));

  const deleteDoc = (id) => setDocs(p => p.filter(d => d.id !== id));

  const sorted = [...docs].sort((a, b) => (b.frequent ? 1 : 0) - (a.frequent ? 1 : 0));

  return { docs: sorted, uploadDoc, toggleFrequent, deleteDoc };
}
