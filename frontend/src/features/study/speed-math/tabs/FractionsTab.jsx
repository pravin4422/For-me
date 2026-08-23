import { useState } from 'react';
import StudySection from '../components/StudySection';
import PracticeSection from '../components/PracticeSection';
import { useSpeedMathData } from '../hooks/useSpeedMathData';
import { useSpeedMathPractice } from '../hooks/useSpeedMathPractice';

export default function FractionsTab() {
  const [section, setSection] = useState('study');
  const { data, loading } = useSpeedMathData('fractions');
  const practiceHook = useSpeedMathPractice('fractions');

  return (
    <div className="speedmath-subtab">
      <div className="speedmath-subtab__nav">
        <button className={`speedmath-subtab__btn ${section === 'study' ? 'active' : ''}`} onClick={() => setSection('study')}>Study</button>
        <button className={`speedmath-subtab__btn ${section === 'practice' ? 'active' : ''}`} onClick={() => setSection('practice')}>Practice</button>
      </div>
      <div className="speedmath-subtab__body">
        {section === 'study' ? (
          <StudySection>
            {loading ? <p className="sm-loading">Loading…</p> : (
              <table className="sc-table">
                <thead>
                  <tr><th>Fraction</th><th>Decimal</th><th>Percent</th></tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{row.decimal}</td>
                      <td>{row.percent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </StudySection>
        ) : (
          <PracticeSection hook={practiceHook} />
        )}
      </div>
    </div>
  );
}
