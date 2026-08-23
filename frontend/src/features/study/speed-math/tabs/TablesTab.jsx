import { useState } from 'react';
import StudySection from '../components/StudySection';
import PracticeSection from '../components/PracticeSection';
import { useSpeedMathData } from '../hooks/useSpeedMathData';
import { useSpeedMathPractice } from '../hooks/useSpeedMathPractice';

export default function TablesTab() {
  const [section, setSection] = useState('study');
  const [selected, setSelected] = useState(2);
  const { data, loading } = useSpeedMathData('tables');
  const practiceHook = useSpeedMathPractice('tables');

  const tableData = data.find(t => t.number === selected);

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
              <div className="tables-layout">
                <div className="tables-selector">
                  {data.map(t => (
                    <button
                      key={t.number}
                      className={`tables-selector__btn ${selected === t.number ? 'active' : ''}`}
                      onClick={() => setSelected(t.number)}
                    >
                      {t.number}
                    </button>
                  ))}
                </div>
                {tableData && (
                  <div className="tables-display">
                    <h4 className="tables-display__title">Table of {selected}</h4>
                    <div className="tables-display__rows">
                      {tableData.rows.map(r => (
                        <div key={r.multiplier} className="tables-display__row">
                          <span>{selected} × {r.multiplier}</span>
                          <span>=</span>
                          <span className="tables-display__result">{r.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </StudySection>
        ) : (
          <PracticeSection hook={practiceHook} />
        )}
      </div>
    </div>
  );
}
