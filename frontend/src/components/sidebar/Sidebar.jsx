import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CheckSquare, BookOpen, FileText, Brain,
  Briefcase, Clock, FolderOpen, Wallet, ShoppingCart, Heart,
  Sparkles, Bell, Settings, ChevronDown, ChevronRight,
  LogOut, User, X, Target, Zap, Stethoscope,
  FlaskConical, Table, Sigma, Divide, Percent, Calculator,
  Mail, Pencil,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import './Sidebar.css';

const NAV = [
  {
    label: 'DASHBOARD',
    items: [
      { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
      {
        label: 'To-Do', icon: <CheckSquare size={18} />, path: '/dashboard/todo/daily', children: [
          { label: 'Daily Tasks',   path: '/dashboard/todo/daily' },
          { label: 'Weekly Tasks',  path: '/dashboard/todo/weekly' },
          { label: 'Monthly Tasks', path: '/dashboard/todo/monthly' },
        ]
      },
    ]
  },
  {
    label: 'STUDY',
    items: [
      {
        label: 'Study', icon: <BookOpen size={18} />, path: '/dashboard/study/planner', children: [
          { label: 'Study Planner',    path: '/dashboard/study/planner' },
          { label: 'Subjects',         path: '/dashboard/study/subjects' },
          { label: 'Topics',           path: '/dashboard/study/topics' },
          { label: 'Revision Tracker', path: '/dashboard/study/revision' },
          { label: 'Practice',         path: '/dashboard/study/practice' },
          { label: 'Mock Tests',       path: '/dashboard/study/mock-tests' },
          { label: 'Analysis',         path: '/dashboard/study/analysis' },
        ]
      },
      {
        label: 'Exams', icon: <FileText size={18} />, path: '/dashboard/exams', children: [
          {
            label: 'RRB', path: '/dashboard/exams/rrb', children: [
              { label: 'RRB NTPC',        path: '/dashboard/exams/rrb/rrb-ntpc' },
              { label: 'RRB Group D',     path: '/dashboard/exams/rrb/rrb-group-d' },
              { label: 'RRB JE',          path: '/dashboard/exams/rrb/rrb-je' },
              { label: 'RRB ALP',         path: '/dashboard/exams/rrb/rrb-alp' },
              { label: 'RRB Paramedical', path: '/dashboard/exams/rrb/rrb-paramedical' },
            ]
          },
          {
            label: 'SSC', path: '/dashboard/exams/ssc', children: [
              { label: 'SSC CGL',  path: '/dashboard/exams/ssc/ssc-cgl' },
              { label: 'SSC CHSL', path: '/dashboard/exams/ssc/ssc-chsl' },
              { label: 'SSC MTS',  path: '/dashboard/exams/ssc/ssc-mts' },
              { label: 'SSC GD',   path: '/dashboard/exams/ssc/ssc-gd' },
            ]
          },
          {
            label: 'TNPSC', path: '/dashboard/exams/tnpsc', children: [
              { label: 'Group 1', path: '/dashboard/exams/tnpsc/tnpsc-group-1' },
              { label: 'Group 2', path: '/dashboard/exams/tnpsc/tnpsc-group-2' },
              { label: 'Group 4', path: '/dashboard/exams/tnpsc/tnpsc-group-4' },
            ]
          },
          {
            label: 'Banking', path: '/dashboard/exams/banking', children: [
              { label: 'IBPS PO',    path: '/dashboard/exams/banking/ibps-po' },
              { label: 'IBPS Clerk', path: '/dashboard/exams/banking/ibps-clerk' },
              { label: 'SBI PO',     path: '/dashboard/exams/banking/sbi-po' },
              { label: 'SBI Clerk',  path: '/dashboard/exams/banking/sbi-clerk' },
            ]
          },
          { label: 'Other Exams', path: '/dashboard/exams/other' },
        ]
      },
      {
        label: 'Aptitude / GRE', icon: <Brain size={18} />, path: '/dashboard/aptitude/shortcuts', children: [
          { label: 'Shortcuts',              path: '/dashboard/aptitude/shortcuts' },
          { label: 'Repeated Question Types',path: '/dashboard/aptitude/repeated' },
          { label: 'Important Concepts',     path: '/dashboard/aptitude/concepts' },
          { label: 'Formula',                path: '/dashboard/aptitude/formula' },
          { label: 'Practice',               path: '/dashboard/aptitude/practice' },
          { label: 'Rank',                   path: '/dashboard/aptitude/rank' },
        ]
      },
      {
        label: 'Mock Tests', icon: <Target size={18} />, path: '/dashboard/mock-test', children: [
          { label: 'Start New Mock Test',  path: '/dashboard/mock-test/setup/select' },
          { label: 'Results',              path: '/dashboard/mock-test/results' },
          { label: 'Performance Analysis', path: '/dashboard/mock-test/analysis' },
        ]
      },
    ]
  },
  {
    label: 'SPEED MATH',
    items: [
      {
        label: 'Speed Math', icon: <Zap size={18} />, path: '/dashboard/study/speed-math/formulas', children: [
          { label: 'Formulas',                  path: '/dashboard/study/speed-math/formulas',      icon: <FlaskConical size={15} /> },
          { label: 'Tables',                    path: '/dashboard/study/speed-math/tables',         icon: <Table size={15} /> },
          { label: 'Squares & Cubes',           path: '/dashboard/study/speed-math/squares-cubes', icon: <Sigma size={15} /> },
          { label: 'Multiplication / Division', path: '/dashboard/study/speed-math/mul-div',        icon: <Divide size={15} /> },
          { label: 'Fractions',                 path: '/dashboard/study/speed-math/fractions',      icon: <Percent size={15} /> },
          { label: 'Basic Calculations',        path: '/dashboard/study/speed-math/basic',          icon: <Calculator size={15} /> },
        ]
      },
    ]
  },
  {
    label: 'CAREER',
    items: [
      {
        label: 'Career', icon: <Briefcase size={18} />, path: '/dashboard/career/government', children: [
          { label: 'Government Opportunities', path: '/dashboard/career/government' },
          { label: 'Private IT Companies',     path: '/dashboard/career/private-it' },
          { label: 'Company Information',      path: '/dashboard/career/company-info' },
          { label: 'Company Watchlist',        path: '/dashboard/career/watchlist' },
          { label: 'Required Skills',          path: '/dashboard/career/skills' },
          { label: 'Interview Preparation',    path: '/dashboard/career/interview' },
          { label: 'Career Resources',         path: '/dashboard/career/resources' },
        ]
      },
    ]
  },
  {
    label: 'PERSONAL',
    items: [
      {
        label: 'Time Balancer', icon: <Clock size={18} />, path: '/dashboard/time', children: [
          { label: 'Daily',   path: '/dashboard/time/daily' },
          { label: 'Weekly',  path: '/dashboard/time/weekly' },
          { label: 'Monthly', path: '/dashboard/time/monthly' },
        ]
      },
      {
        label: 'Documents', icon: <FolderOpen size={18} />, path: '/dashboard/documents/original', children: [
          { label: 'Original Documents', path: '/dashboard/documents/original' },
          { label: 'Worksheets',         path: '/dashboard/documents/worksheets' },
          { label: 'Personal Documents', path: '/dashboard/documents/personal' },
          { label: 'Study Documents',    path: '/dashboard/documents/study' },
          { label: 'Images',             path: '/dashboard/documents/images' },
        ]
      },
      {
        label: 'Budget', icon: <Wallet size={18} />, path: '/dashboard/budget/income', children: [
          { label: 'Income',      path: '/dashboard/budget/income' },
          { label: 'Expenses',    path: '/dashboard/budget/expenses' },
          { label: 'Investments', path: '/dashboard/budget/investments' },
          { label: 'Savings',     path: '/dashboard/budget/savings' },
          { label: 'Documents',   path: '/dashboard/budget/documents' },
          { label: 'Reports',     path: '/dashboard/budget/reports' },
        ]
      },
      {
        label: 'Shopping Planner', icon: <ShoppingCart size={18} />, path: '/dashboard/shopping/items', children: [
          { label: 'Items',        path: '/dashboard/shopping/items' },
          { label: 'Weekly List',  path: '/dashboard/shopping/weekly' },
          { label: 'Monthly List', path: '/dashboard/shopping/monthly' },
          { label: 'Yearly List',  path: '/dashboard/shopping/yearly' },
        ]
      },
      {
        label: 'Health', icon: <Heart size={18} />, path: '/dashboard/health', children: [
          { label: 'Water Intake',    path: '/dashboard/health/water' },
          { label: 'Sleep Hours',     path: '/dashboard/health/sleep' },
          { label: 'Steps / Travel',  path: '/dashboard/health/steps' },
          { label: 'Workout',         path: '/dashboard/health/workout' },
          { label: 'Food / Nutrition',path: '/dashboard/health/nutrition' },
          { label: 'Calories',        path: '/dashboard/health/calories' },
          { label: 'Daily Checklist',       path: '/dashboard/health/checklist' },
          { label: 'Medical Conditions',     path: '/dashboard/health/conditions', icon: <Stethoscope size={16} /> },
        ]
      },
      {
        label: 'Motivation', icon: <Sparkles size={18} />, path: '/dashboard/motivation/quotes', children: [
          { label: 'Quotes',       path: '/dashboard/motivation/quotes' },
          { label: 'Images',       path: '/dashboard/motivation/images' },
          { label: 'Goals',        path: '/dashboard/motivation/goals' },
          { label: 'Vision Board', path: '/dashboard/motivation/vision-board' },
        ]
      },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={18} /> },
      { label: 'Profile',       path: '/dashboard/profile',        icon: <User size={18} /> },
      { label: 'Settings',      path: '/dashboard/settings',      icon: <Settings size={18} /> },
    ]
  },
];

function NavItem({ item, collapsed, depth = 0 }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hasChildren = !!item.children?.length;

  // auto-open if any descendant is active (recursive)
  function hasActiveDescendant(children) {
    return children.some(c =>
      (c.path && (c.children ? pathname.startsWith(c.path) : pathname === c.path)) ||
      (c.children && hasActiveDescendant(c.children))
    );
  }
  const childActive = hasChildren && hasActiveDescendant(item.children);
  const parentSelfActive = !hasChildren ? false : (item.path ? pathname === item.path : false);
  const [open, setOpen] = useState(childActive || parentSelfActive);

  useEffect(() => {
    if (childActive || parentSelfActive) setOpen(true);
  }, [pathname]);

  if (hasChildren) {
    return (
      <div className={`nav-group ${open ? 'open' : ''}`}>
        <div className={`nav-item nav-parent depth-${depth}${childActive || parentSelfActive ? ' active' : ''}`}>
          {/* icon + label → navigate if item has a path */}
          <span
            className="nav-icon"
            onClick={() => { if (item.path) { navigate(item.path); setOpen(true); } }}
            style={{ cursor: item.path ? 'pointer' : 'default' }}
          >
            {item.icon}
          </span>
          {!collapsed && (
            <span
              className="nav-label"
              onClick={() => { if (item.path) { navigate(item.path); setOpen(true); } else setOpen(o => !o); }}
              style={{ cursor: 'pointer', flex: 1 }}
            >
              {item.label}
            </span>
          )}
          {!collapsed && (
            <span
              className="nav-chevron"
              onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
              style={{ cursor: 'pointer' }}
            >
              {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </div>

        {(!collapsed || depth > 0) && open && (
          <div className="nav-children">
            {item.children.map(child => (
              <NavItem key={child.label} item={child} collapsed={false} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end
      className={({ isActive }) => `nav-item nav-leaf depth-${depth}${isActive ? ' active' : ''}`}
      title={collapsed && depth === 0 ? item.label : ''}
    >
      {item.icon && <span className="nav-icon">{item.icon}</span>}
      {!collapsed && <span className="nav-label">{item.label}</span>}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onClose, mobile, onToggle }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [popupOpen, setPopupOpen]   = useState(false);
  const popupRef                    = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (!popupOpen) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setPopupOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popupOpen]);

  const pictureUrl = user?.photoURL || null;
  const userName   = user?.displayName || user?.email?.split('@')[0] || 'My Account';
  const userEmail  = user?.email || '';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobile ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon"><Zap size={20} /></div>
            <span className="logo-text">ForMe</span>
          </div>
        )}
        <div className="sidebar-header-actions">
          {mobile
            ? <button className="sidebar-close" onClick={onClose}><X size={18} /></button>
            : <button className="sidebar-toggle-btn" onClick={onToggle}>
                {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
          }
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(section => (
          <div key={section.label} className="nav-section">
            {!collapsed && <span className="nav-section-label">{section.label}</span>}
            {section.items.map(item => (
              <NavItem key={item.label} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" ref={popupRef} style={{ position: 'relative' }}>
          <div
            className="user-avatar"
            onClick={() => setPopupOpen(o => !o)}
            style={{ cursor: 'pointer', overflow: 'hidden' }}
          >
            {pictureUrl
              ? <img src={pictureUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : <User size={16} />
            }
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{userName || 'My Account'}</span>
              <span className="user-role">Personal</span>
            </div>
          )}

          {popupOpen && (
            <div className="profile-popup">
              <div className="pp-avatar-wrap">
                {pictureUrl
                  ? <img src={pictureUrl} alt={userName} className="pp-avatar" />
                  : <div className="pp-avatar pp-avatar-placeholder"><User size={32} /></div>
                }
              </div>
              <div className="pp-name">{userName}</div>
              <div className="pp-divider" />
              <div className="pp-rows">
                {userEmail && <div className="pp-row"><Mail size={13} /><span>{userEmail}</span></div>}
              </div>
              <button className="pp-edit-btn" onClick={() => { setPopupOpen(false); navigate('/dashboard/profile'); }}>
                <Pencil size={13} /> View Full Profile
              </button>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
