import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Layers, FileText } from 'lucide-react';
import ExamCard from './components/ExamCard';
import AddExamModal from './components/AddExamModal';
import './exams.css';

const CATEGORIES = [
  {
    key: 'rrb', label: 'RRB', description: 'Railway Recruitment Board',
    exams: [
      { id: 'rrb-ntpc',        name: 'RRB NTPC' },
      { id: 'rrb-group-d',     name: 'RRB Group D' },
      { id: 'rrb-je',          name: 'RRB JE' },
      { id: 'rrb-alp',         name: 'RRB ALP' },
      { id: 'rrb-paramedical', name: 'RRB Paramedical' },
    ],
  },
  {
    key: 'ssc', label: 'SSC', description: 'Staff Selection Commission',
    exams: [
      { id: 'ssc-cgl',  name: 'SSC CGL' },
      { id: 'ssc-chsl', name: 'SSC CHSL' },
      { id: 'ssc-mts',  name: 'SSC MTS' },
      { id: 'ssc-gd',   name: 'SSC GD' },
    ],
  },
  {
    key: 'tnpsc', label: 'TNPSC', description: 'Tamil Nadu Public Service Commission',
    exams: [
      { id: 'tnpsc-group-1', name: 'Group 1' },
      { id: 'tnpsc-group-2', name: 'Group 2' },
      { id: 'tnpsc-group-4', name: 'Group 4' },
    ],
  },
  {
    key: 'banking', label: 'Banking', description: 'Banking Sector Exams',
    exams: [
      { id: 'ibps-po',    name: 'IBPS PO' },
      { id: 'ibps-clerk', name: 'IBPS Clerk' },
      { id: 'sbi-po',     name: 'SBI PO' },
      { id: 'sbi-clerk',  name: 'SBI Clerk' },
    ],
  },
  {
    key: 'other', label: 'Other Exams', description: 'User-added exams',
    exams: [],
  },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

// Level 1 — all categories
function AllCategories() {
  const navigate = useNavigate();
  return (
    <div className="category-dashboard">
      <div className="category-dashboard__header">
        <div className="category-dashboard__title">
          <Layers size={20} />
          <h2>Exams</h2>
        </div>
      </div>
      <div className="exam-grid">
        {CATEGORIES.map(cat => (
          <div
            key={cat.key}
            className="exam-card"
            onClick={() => navigate(`/dashboard/exams/${cat.key}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="exam-card__icon"><FileText size={20} /></div>
            <div className="exam-card__body">
              <h4 className="exam-card__name">{cat.label}</h4>
              <p className="exam-card__desc">{cat.description}</p>
              <span className="exam-card__count">{cat.exams.length} exams</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Level 2 — exams under a category
function CategoryExams({ category }) {
  const cat = CAT_MAP[category];
  const [extraExams, setExtraExams] = useState({});
  const [showModal, setShowModal]   = useState(false);

  const baseExams = cat?.exams ?? [];
  const exams     = [...baseExams, ...(extraExams[category] ?? [])];
  const label     = cat?.label ?? category.toUpperCase();

  const handleAdd = (exam) =>
    setExtraExams(prev => ({ ...prev, [category]: [...(prev[category] ?? []), exam] }));

  return (
    <div className="category-dashboard">
      <div className="category-dashboard__header">
        <div className="category-dashboard__title">
          <Layers size={20} />
          <h2>{label} Exams</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Exam
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="category-dashboard__empty">No exams added yet.</div>
      ) : (
        <div className="exam-grid">
          {exams.map(exam => (
            <ExamCard key={exam.id} exam={exam} category={category} />
          ))}
        </div>
      )}

      {showModal && (
        <AddExamModal
          category={category}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function CategoryDashboard() {
  const { category } = useParams();
  if (!category) return <AllCategories />;
  return <CategoryExams category={category} />;
}
