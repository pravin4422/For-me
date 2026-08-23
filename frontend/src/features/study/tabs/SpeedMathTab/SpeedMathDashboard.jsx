import React, { useState } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { Zap, FlaskConical, Table, Sigma, Divide, Percent, Calculator } from 'lucide-react';
import FormulasTab             from './FormulasTab';
import TablesTab               from './TablesTab';
import SquareCubeTab           from './SquareCubeTab';
import MultiplicationDivisionTab from './MultiplicationDivisionTab';
import FractionFactorsTab      from './FractionFactorsTab';

const SUB_TABS = [
  { key: 'formulas',  label: 'Formulas',                  icon: <FlaskConical size={15} />, path: 'formulas' },
  { key: 'tables',    label: 'Tables',                    icon: <Table size={15} />,        path: 'tables' },
  { key: 'squares-cubes', label: 'Squares & Cubes',       icon: <Sigma size={15} />,        path: 'squares-cubes' },
  { key: 'mul-div',   label: 'Multiplication / Division', icon: <Divide size={15} />,       path: 'mul-div' },
  { key: 'fractions', label: 'Fractions & Factors',       icon: <Percent size={15} />,      path: 'fractions' },
  { key: 'basic',     label: 'Basic Calculations',        icon: <Calculator size={15} />,   path: 'basic' },
];

function BasicTab() {
  const [section, setSection] = useState('study');
  return (
    <div className="speedmath-subtab">
      <div className="speedmath-subtab__nav">
        <button className={`speedmath-subtab__btn ${section === 'study' ? 'active' : ''}`} onClick={() => setSection('study')}>Study</button>
        <button className={`speedmath-subtab__btn ${section === 'practice' ? 'active' : ''}`} onClick={() => setSection('practice')}>Practice</button>
      </div>
      <div className="speedmath-subtab__body">
        <div className="tab-empty"><Calculator size={36} /><p>No basic calculations content yet.</p></div>
      </div>
    </div>
  );
}

export default function SpeedMathDashboard() {
  return (
    <div className="speedmath-dashboard">
      <div className="speedmath-dashboard__header">
        <Zap size={18} />
        <h2>Speed Math</h2>
      </div>
      <div className="speedmath-dashboard__layout">
        <nav className="speedmath-subnav">
          {SUB_TABS.map(t => (
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
        <div className="speedmath-dashboard__content">
          <Routes>
            <Route index                  element={<Navigate to="formulas" replace />} />
            <Route path="formulas"        element={<FormulasTab />} />
            <Route path="tables"          element={<TablesTab />} />
            <Route path="squares-cubes"   element={<SquareCubeTab />} />
            <Route path="mul-div"         element={<MultiplicationDivisionTab />} />
            <Route path="fractions"       element={<FractionFactorsTab />} />
            <Route path="basic"           element={<BasicTab />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
