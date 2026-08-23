import { useState } from 'react';
import { Percent } from 'lucide-react';

export default function FractionFactorsTab() {
  const [section, setSection] = useState('study');

  return (
    <div className="speedmath-subtab">
      <div className="speedmath-subtab__nav">
        <button className={`speedmath-subtab__btn ${section === 'study' ? 'active' : ''}`} onClick={() => setSection('study')}>Study</button>
        <button className={`speedmath-subtab__btn ${section === 'practice' ? 'active' : ''}`} onClick={() => setSection('practice')}>Practice</button>
      </div>
      <div className="speedmath-subtab__body">
        {section === 'study' ? (
          <div className="tab-empty"><Percent size={36} /><p>No fractions &amp; factors content yet.</p></div>
        ) : (
          <div className="tab-empty"><Percent size={36} /><p>No fractions &amp; factors practice yet.</p></div>
        )}
      </div>
    </div>
  );
}
