import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import './study.css';
import {
  CalendarDays, BookOpen, FileText, RotateCcw,
  PenLine, ClipboardList, BarChart2, Zap
} from 'lucide-react';
import StudyPlannerTab    from './tabs/StudyPlannerTab';
import SubjectsTab        from './tabs/SubjectsTab';
import TopicsTab          from './tabs/TopicsTab';
import RevisionTrackerTab from './tabs/RevisionTrackerTab';
import PracticeTab        from './tabs/PracticeTab';
import MockTestsTab       from './tabs/MockTestsTab';
import AnalysisTab        from './tabs/AnalysisTab';
import SpeedMathDashboard from './speed-math/SpeedMathDashboard';

const BASE = '/dashboard/study';
const TABS = [
  { path: `${BASE}/planner`,    label: 'Study Planner',   icon: <CalendarDays size={15} /> },
  { path: `${BASE}/subjects`,   label: 'Subjects',         icon: <BookOpen size={15} /> },
  { path: `${BASE}/topics`,     label: 'Topics',           icon: <FileText size={15} /> },
  { path: `${BASE}/revision`,   label: 'Revision Tracker', icon: <RotateCcw size={15} /> },
  { path: `${BASE}/practice`,   label: 'Practice',         icon: <PenLine size={15} /> },
  { path: `${BASE}/mock-tests`, label: 'Mock Tests',       icon: <ClipboardList size={15} /> },
  { path: `${BASE}/analysis`,   label: 'Analysis',         icon: <BarChart2 size={15} /> },
  { path: `${BASE}/speed-math`, label: 'Speed Math',       icon: <Zap size={15} /> },
];

export default function StudyDashboard() {
  const { pathname } = useLocation();
  const isSpeedMath = pathname.startsWith('/dashboard/study/speed-math');

  return (
    <div className="study-dashboard">
      {!isSpeedMath && (
        <nav className="study-tabs">
          {TABS.map(t => (
            <NavLink
              key={t.path}
              to={t.path}
              className={({ isActive }) => `study-tab${isActive ? ' active' : ''}`}
            >
              {t.icon}
              <span>{t.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      <div className="study-dashboard__content">
        <Routes>
          <Route index                    element={<Navigate to="planner" replace />} />
          <Route path="planner"           element={<StudyPlannerTab />} />
          <Route path="subjects"          element={<SubjectsTab />} />
          <Route path="topics"            element={<TopicsTab />} />
          <Route path="revision"          element={<RevisionTrackerTab />} />
          <Route path="practice"          element={<PracticeTab />} />
          <Route path="mock-tests"        element={<MockTestsTab />} />
          <Route path="analysis"          element={<AnalysisTab />} />
          <Route path="speed-math/*"      element={<SpeedMathDashboard />} />
        </Routes>
      </div>
    </div>
  );
}
