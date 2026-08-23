import { BookOpen, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

function SubjectRow({ subject }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="syllabus-subject">
      <button className="syllabus-subject__toggle" onClick={() => setOpen(o => !o)}>
        {open ? <Minus size={14} /> : <Plus size={14} />}
        <span>{subject.name}</span>
      </button>
      {open && subject.topics?.length > 0 && (
        <ul className="syllabus-topics">
          {subject.topics.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
    </div>
  );
}

export default function SyllabusTab({ data, loading }) {
  if (loading) return <div className="tab-loading">Loading syllabus...</div>;
  const syllabus = data?.syllabus ?? [];

  return (
    <div className="tab-section">
      <div className="tab-section__header"><BookOpen size={16} /><h3>Syllabus</h3></div>
      {syllabus.length === 0
        ? <div className="tab-empty">No syllabus added yet.</div>
        : syllabus.map((s, i) => <SubjectRow key={i} subject={s} />)
      }
    </div>
  );
}
