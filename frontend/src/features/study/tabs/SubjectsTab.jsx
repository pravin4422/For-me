import { useState } from 'react';
import { BookOpen, Plus, Star, Eye, Trash2 } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useStudyDocuments } from '../hooks/useStudyDocuments';
import SubjectCard from '../components/SubjectCard';
import AddSubjectModal from '../components/AddSubjectModal';
import DocumentUploader from '../components/DocumentUploader';
import FileViewer from '../components/FileViewer';

function SubjectDocs({ subjectId }) {
  const { docs, uploadDoc, toggleFrequent, deleteDoc } = useStudyDocuments(subjectId);
  const [viewing, setViewing] = useState(null);

  return (
    <div className="subject-docs">
      <DocumentUploader onUpload={uploadDoc} />
      {docs.length > 0 && (
        <ul className="doc-list">
          {docs.map(d => (
            <li key={d.id} className={`doc-list__item ${d.frequent ? 'doc-list__item--frequent' : ''}`}>
              <span className="doc-list__name">{d.name}</span>
              <div className="doc-list__actions">
                <button className="icon-btn" title="Frequently used" onClick={() => toggleFrequent(d.id)}>
                  <Star size={13} fill={d.frequent ? 'currentColor' : 'none'} />
                </button>
                <button className="icon-btn" onClick={() => setViewing(d)}><Eye size={13} /></button>
                <button className="icon-btn icon-btn--danger" onClick={() => deleteDoc(d.id)}><Trash2 size={13} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {viewing && <FileViewer doc={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

export default function SubjectsTab() {
  const { subjects, loading, addSubject, updateSubject, deleteSubject } = useSubjects();
  const [showModal, setShowModal]   = useState(false);
  const [expanded, setExpanded]     = useState(null);
  const [editing, setEditing]       = useState(null);

  if (loading) return <div className="tab-loading">Loading subjects…</div>;

  const handleEdit = (subject) => setEditing(subject);
  const handleSaveEdit = (data) => {
    updateSubject(editing.id, data);
    setEditing(null);
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <BookOpen size={18} />
          <h2>Subjects</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Add Subject</button>
      </div>

      {subjects.length === 0 ? (
        <div className="tab-empty">
          <BookOpen size={40} />
          <p>No subjects yet — add your first subject.</p>
        </div>
      ) : (
        <div className="subjects-list">
          {subjects.map(s => (
            <div key={s.id}>
              <SubjectCard
                subject={s}
                onEdit={handleEdit}
                onDelete={deleteSubject}
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              />
              {expanded === s.id && <SubjectDocs subjectId={s.id} />}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddSubjectModal onSave={addSubject} onClose={() => setShowModal(false)} />
      )}
      {editing && (
        <AddSubjectModal
          onSave={handleSaveEdit}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
