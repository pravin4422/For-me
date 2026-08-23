import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Info, BookOpen, Calculator, TrendingDown,
  FolderOpen, CalendarDays, ListChecks, ClipboardList, BarChart2, Plus, FileText
} from 'lucide-react';
import useExamData from './hooks/useExamData';
import OverviewTab        from './tabs/OverviewTab';
import SyllabusTab        from './tabs/SyllabusTab';
import ScoreCalculatorTab from './tabs/ScoreCalculatorTab';
import CutoffTab          from './tabs/CutoffTab';
import StudyMaterialTab   from './tabs/StudyMaterialTab';
import PlannerTab         from './tabs/PlannerTab';
import TopicsTab          from './tabs/TopicsTab';
import MockTestsTab       from './tabs/MockTestsTab';
import AnalysisTab        from './tabs/AnalysisTab';
import AddExamModal       from './components/AddExamModal';
import './exams.css';

const TABS = [
  { key: 'overview',        label: 'Overview',          icon: <Info size={15} /> },
  { key: 'syllabus',        label: 'Syllabus',          icon: <BookOpen size={15} /> },
  { key: 'score',           label: 'Score Calculator',  icon: <Calculator size={15} /> },
  { key: 'cutoff',          label: 'Cutoff',            icon: <TrendingDown size={15} /> },
  { key: 'study-material',  label: 'Study Material',    icon: <FolderOpen size={15} /> },
  { key: 'planner',         label: 'Planner',           icon: <CalendarDays size={15} /> },
  { key: 'topics',          label: 'Topics',            icon: <ListChecks size={15} /> },
  { key: 'mock-tests',      label: 'Mock Tests',        icon: <ClipboardList size={15} /> },
  { key: 'analysis',        label: 'Analysis',          icon: <BarChart2 size={15} /> },
];

export default function ExamDashboard() {
  const { examId, category } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const { data, loading } = useExamData(examId);

  useEffect(() => {
    setActiveTab('overview');
  }, [examId]);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':       return <OverviewTab        data={data} loading={loading} />;
      case 'syllabus':       return <SyllabusTab        data={data} loading={loading} />;
      case 'score':          return <ScoreCalculatorTab data={data} loading={loading} />;
      case 'cutoff':         return <CutoffTab          data={data} loading={loading} />;
      case 'study-material': return <StudyMaterialTab   examId={examId} />;
      case 'planner':        return <PlannerTab         data={data} loading={loading} />;
      case 'topics':         return <TopicsTab          data={data} loading={loading} />;
      case 'mock-tests':     return <MockTestsTab       examId={examId} />;
      case 'analysis':       return <AnalysisTab        examId={examId} />;
      default:               return <OverviewTab        data={data} loading={loading} />;
    }
  };

  const examName = data?.name
    ? data.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : examId?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ?? '';

  return (
    <div className="exam-dashboard">
      <div className="exam-dashboard__header">
        <div className="exam-dashboard__title">
          <FileText size={18} />
          <h2>{examName}</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Exam
        </button>
      </div>
      <div className="exam-dashboard__tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`exam-tab-btn${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="exam-dashboard__content">
        {renderTab()}
      </div>
      {showModal && (
        <AddExamModal
          category={category}
          onAdd={() => {}}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
