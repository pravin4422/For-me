import { NavLink } from 'react-router-dom';
import { FlaskConical, Table, Sigma, Divide, Percent, Calculator } from 'lucide-react';

export const SPEED_MATH_TOPICS = [
  { key: 'formulas',      label: 'Formulas',                  path: '/dashboard/study/speed-math/formulas',      icon: <FlaskConical size={14} /> },
  { key: 'tables',        label: 'Tables',                    path: '/dashboard/study/speed-math/tables',         icon: <Table size={14} /> },
  { key: 'squares-cubes', label: 'Squares & Cubes',           path: '/dashboard/study/speed-math/squares-cubes', icon: <Sigma size={14} /> },
  { key: 'mul-div',       label: 'Multiplication / Division', path: '/dashboard/study/speed-math/mul-div',        icon: <Divide size={14} /> },
  { key: 'fractions',     label: 'Fractions',                 path: '/dashboard/study/speed-math/fractions',      icon: <Percent size={14} /> },
  { key: 'basic',         label: 'Basic Calculations',        path: '/dashboard/study/speed-math/basic',          icon: <Calculator size={14} /> },
];

export default function SpeedMathSidebar() {
  return (
    <nav className="speedmath-subnav">
      {SPEED_MATH_TOPICS.map(t => (
        <NavLink
          key={t.key}
          to={t.path}
          className={({ isActive }) => `speedmath-subnav__item ${isActive ? 'active' : ''}`}
        >
          {t.icon}
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
