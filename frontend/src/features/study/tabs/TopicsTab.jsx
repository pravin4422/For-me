import { useState } from 'react';
import { FileText, Plus, Star, Eye, Trash2 } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useTopics } from '../hooks/useTopics';
import { useStudyDocuments } from '../hooks/useStudyDocuments';
import TopicCard from '../components/TopicCard';
import AddTopicModal from '../components/AddTopicModal';
import DocumentUploader from '../components/DocumentUploader';
import FileViewer from '../components/FileViewer';

function TopicDocs({ topicId }) {
  const { docs, uploadDoc, toggleFrequent, deleteDoc } = useStudyDocuments(topicId);
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

export default function TopicsTab() {
  const { subjects, loading: subLoading } = useSubjects();
  const [filterSubject, setFilterSubject] = useState('all');
  const { topics, loading, addTopic, updateTopic, deleteTopic } = useTopics(
    filterSubject !== 'all' ? filterSubject : null
  );
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded]   = useState(null);

  if (loading || subLoading) return <div className="tab-loading">Loading topics…</div>;

  const visible = filterSubject === 'all'
    ? topics
    : topics.filter(t => String(t.subjectId) === String(filterSubject));

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="tab-header__left">
          <FileText size={18} />
          <h2>Topics</h2>
        </div>
        <div className="tab-header__right">
          <select
            className="select-input"
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Add Topic</button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="tab-empty">
          <FileText size={40} />
          <p>No topics yet — add your first topic.</p>
        </div>
      ) : (
        <div className="topics-list">
          {visible.map(t => (
            <div key={t.id}>
              <TopicCard
                topic={t}
                onEdit={(topic) => updateTopic(topic.id, topic)}
                onDelete={deleteTopic}
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}
              />
              {expanded === t.id && <TopicDocs topicId={t.id} />}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddTopicModal
          subjects={subjects}
          onSave={addTopic}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
