import { Routes, Route, Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import SpeedMathSidebar from './SpeedMathSidebar';
import FormulasTab from './tabs/FormulasTab';
import TablesTab from './tabs/TablesTab';
import SquaresCubesTab from './tabs/SquaresCubesTab';
import MultiplicationDivisionTab from './tabs/MultiplicationDivisionTab';
import FractionsTab from './tabs/FractionsTab';
import BasicCalculationsTab from './tabs/BasicCalculationsTab';
import './speed-math.css';
import '../tabs/SpeedMathTab/SpeedMathDashboard.css';

export default function SpeedMathDashboard() {
  return (
    <div className="speedmath-dashboard">
      <div className="speedmath-dashboard__header">
        <Zap size={18} />
        <h2>Speed Math</h2>
      </div>
      <div className="speedmath-dashboard__layout">
        <SpeedMathSidebar />
        <div className="speedmath-dashboard__content">
          <Routes>
            <Route index                  element={<Navigate to="formulas" replace />} />
            <Route path="formulas"        element={<FormulasTab />} />
            <Route path="tables"          element={<TablesTab />} />
            <Route path="squares-cubes"   element={<SquaresCubesTab />} />
            <Route path="mul-div"         element={<MultiplicationDivisionTab />} />
            <Route path="fractions"       element={<FractionsTab />} />
            <Route path="basic"           element={<BasicCalculationsTab />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
