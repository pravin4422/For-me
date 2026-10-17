import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Home } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import NotificationBell from '../../features/notifications/NotificationBell';
import './DashboardLayout.css';

const ROUTE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/todo/daily': 'Daily Tasks',
  '/dashboard/todo/weekly': 'Weekly Tasks',
  '/dashboard/todo/monthly': 'Monthly Tasks',
  '/dashboard/study/planner': 'Study Planner',
  '/dashboard/study/subjects': 'Subjects',
  '/dashboard/study/topics': 'Topics',
  '/dashboard/study/revision': 'Revision Tracker',
  '/dashboard/study/practice': 'Practice',
  '/dashboard/study/mock-tests': 'Mock Tests',
  '/dashboard/study/analysis': 'Analysis',
  '/dashboard/study/speed-math/formulas': 'Formulas',
  '/dashboard/study/speed-math/tables': 'Tables',
  '/dashboard/study/speed-math/squares-cubes': 'Squares & Cubes',
  '/dashboard/study/speed-math/mul-div': 'Multiplication / Division',
  '/dashboard/study/speed-math/fractions': 'Fractions',
  '/dashboard/study/speed-math/basic': 'Basic Calculations',
  '/dashboard/exams': 'Exams',
  '/dashboard/exams/rrb': 'RRB',
  '/dashboard/exams/ssc': 'SSC',
  '/dashboard/exams/tnpsc': 'TNPSC',
  '/dashboard/exams/banking': 'Banking',
  '/dashboard/exams/other': 'Other Exams',
  '/dashboard/aptitude/shortcuts': 'Shortcuts',
  '/dashboard/aptitude/repeated': 'Repeated Question Types',
  '/dashboard/aptitude/concepts': 'Important Concepts',
  '/dashboard/aptitude/practice': 'Practice',
  '/dashboard/aptitude/rank': 'Rank',
  '/dashboard/mocktest/new': 'Start New Mock Test',
  '/dashboard/mocktest/results': 'Results',
  '/dashboard/mocktest/analysis': 'Performance Analysis',
  '/dashboard/career/government': 'Government Opportunities',
  '/dashboard/career/private-it': 'Private IT Companies',
  '/dashboard/career/watchlist': 'Company Watchlist',
  '/dashboard/career/skills': 'Required Skills',
  '/dashboard/career/interview': 'Interview Preparation',
  '/dashboard/time/daily': 'Daily Time',
  '/dashboard/time/weekly': 'Weekly Time',
  '/dashboard/time/monthly': 'Monthly Time',
  '/dashboard/documents/original': 'Original Documents',
  '/dashboard/documents/worksheets': 'Worksheets',
  '/dashboard/documents/personal': 'Personal Documents',
  '/dashboard/documents/study': 'Study Documents',
  '/dashboard/documents/frequent': 'Frequently Used',
  '/dashboard/documents/images': 'Images',
  '/dashboard/budget/income': 'Income',
  '/dashboard/budget/expenses': 'Expenses',
  '/dashboard/budget/investments': 'Investments',
  '/dashboard/budget/savings': 'Savings',
  '/dashboard/budget/documents': 'Budget Documents',
  '/dashboard/budget/reports': 'Reports',
  '/dashboard/shopping/items': 'Items',
  '/dashboard/shopping/weekly': 'Weekly List',
  '/dashboard/shopping/monthly': 'Monthly List',
  '/dashboard/shopping/yearly': 'Yearly List',
  '/dashboard/health': 'Health',
  '/dashboard/health/water': 'Water Intake',
  '/dashboard/health/sleep': 'Sleep Hours',
  '/dashboard/health/steps': 'Steps / Travel',
  '/dashboard/health/workout': 'Workout',
  '/dashboard/health/nutrition': 'Food / Nutrition',
  '/dashboard/health/calories': 'Calories',
  '/dashboard/health/checklist': 'Daily Checklist',
  '/dashboard/health/conditions': 'Medical Conditions',
  '/dashboard/motivation/quotes': 'Quotes',
  '/dashboard/motivation/images': 'Images',
  '/dashboard/motivation/goals': 'Goals',
  '/dashboard/motivation/vision-board': 'Vision Board',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/settings':                'Settings',
  '/dashboard/settings/profile':        'Settings',
  '/dashboard/settings/authentication': 'Settings',
  '/dashboard/settings/storage':        'Settings',
  '/dashboard/settings/preferences':    'Settings',
  '/dashboard/settings/data-export':    'Settings',
};

export default function DashboardLayout({ children, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  let location;
  try { location = useLocation(); } catch { location = { pathname: '/dashboard' }; }
  const title = ROUTE_TITLES[location.pathname] || 'Dashboard';
  const navigate = useNavigate();

  return (
    <div className="dashboard-shell">
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <Sidebar collapsed={collapsed} mobile={mobileOpen} onClose={() => setMobileOpen(false)} onToggle={() => {
        if (window.innerWidth <= 768) setMobileOpen(o => !o);
        else setCollapsed(o => !o);
      }} />

      <div className="dashboard-main">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{title}</h1>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={() => navigate('/')} aria-label="Go to home">
              <Home size={18} />
            </button>
            <div className="search-box">
              <Search size={15} />
              <input placeholder="Search..." />
            </div>
            <button className="icon-btn" onClick={toggle}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <NotificationBell />
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
