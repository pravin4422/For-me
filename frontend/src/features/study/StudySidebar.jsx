import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, CalendarDays, FileText, RotateCcw,
  PenLine, ClipboardList, BarChart2, Zap,
  ChevronDown, ChevronRight, FlaskConical,
  Table, Sigma, Divide, Percent, Calculator
} from 'lucide-react';

const STUDY_NAV = {
  label: 'Study',
  icon: <BookOpen size={18} />,
  path: '/dashboard/study/planner',
  children: [
    { label: 'Study Planner',    path: '/dashboard/study/planner',    icon: <CalendarDays size={15} /> },
    { label: 'Subjects',         path: '/dashboard/study/subjects',   icon: <BookOpen size={15} /> },
    { label: 'Topics',           path: '/dashboard/study/topics',     icon: <FileText size={15} /> },
    { label: 'Revision Tracker', path: '/dashboard/study/revision',   icon: <RotateCcw size={15} /> },
    { label: 'Practice',         path: '/dashboard/study/practice',   icon: <PenLine size={15} /> },
    { label: 'Mock Tests',       path: '/dashboard/study/mock-tests', icon: <ClipboardList size={15} /> },
    { label: 'Analysis',         path: '/dashboard/study/analysis',   icon: <BarChart2 size={15} /> },
    {
      label: 'Speed Math',
      icon: <Zap size={15} />,
      path: '/dashboard/study/speed-math/formulas',
      children: [
        { label: 'Formulas',                  path: '/dashboard/study/speed-math/formulas',      icon: <FlaskConical size={14} /> },
        { label: 'Tables',                    path: '/dashboard/study/speed-math/tables',         icon: <Table size={14} /> },
        { label: 'Squares & Cubes',           path: '/dashboard/study/speed-math/squares-cubes', icon: <Sigma size={14} /> },
        { label: 'Multiplication / Division', path: '/dashboard/study/speed-math/mul-div',        icon: <Divide size={14} /> },
        { label: 'Fractions & Factors',       path: '/dashboard/study/speed-math/fractions',      icon: <Percent size={14} /> },
        { label: 'Basic Calculations',        path: '/dashboard/study/speed-math/basic',          icon: <Calculator size={14} /> },
      ],
    },
  ],
};

function StudyNavItem({ item, depth = 0 }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hasChildren = !!item.children?.length;

  function hasActiveDescendant(children) {
    return children.some(c =>
      (c.path && pathname.startsWith(c.path)) ||
      (c.children && hasActiveDescendant(c.children))
    );
  }

  const childActive = hasChildren && hasActiveDescendant(item.children);
  const [open, setOpen] = useState(childActive);

  // keep dropdown open whenever a child route becomes active
  if (childActive && !open) setOpen(true);

  if (hasChildren) {
    return (
      <div className={`nav-group ${open ? 'open' : ''}`}>
        <div className={`nav-item nav-parent depth-${depth}${childActive ? ' active' : ''}`}>
          <span
            className="nav-icon"
            onClick={() => item.path && navigate(item.path)}
            style={{ cursor: item.path ? 'pointer' : 'default' }}
          >
            {item.icon}
          </span>
          <span
            className="nav-label"
            onClick={() => { if (item.path) navigate(item.path); else setOpen(o => !o); }}
            style={{ cursor: 'pointer', flex: 1 }}
          >
            {item.label}
          </span>
          <span
            className="nav-chevron"
            onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
            style={{ cursor: 'pointer' }}
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </div>
        {open && (
          <div className="nav-children">
            {item.children.map(child => (
              <StudyNavItem key={child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `nav-item nav-leaf depth-${depth}${isActive ? ' active' : ''}`}
    >
      {item.icon && <span className="nav-icon">{item.icon}</span>}
      <span className="nav-label">{item.label}</span>
    </NavLink>
  );
}

export default function StudySidebar() {
  return <StudyNavItem item={STUDY_NAV} depth={0} />;
}
