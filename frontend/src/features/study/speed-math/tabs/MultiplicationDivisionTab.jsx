import { useState } from 'react';
import StudySection from '../components/StudySection';
import PracticeSection from '../components/PracticeSection';
import { useSpeedMathData } from '../hooks/useSpeedMathData';
import { useSpeedMathPractice } from '../hooks/useSpeedMathPractice';

export default function MultiplicationDivisionTab() {
  const [section, setSection] = useState('study');
  const { data, loading } = useSpeedMathData('mul-div');
  const practiceHook = useSpeedMathPractice('mul-div');

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
              <div className="formula-grid">
                {data.map(item => (
                  <div key={item.id} className="formula-card">
                    <h4 className="formula-card__title">{item.title}</h4>
                    <p className="formula-card__content">{item.content}</p>
                  </div>
                ))}
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
