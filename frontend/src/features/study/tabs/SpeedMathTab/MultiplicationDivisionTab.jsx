import { useState } from 'react';
import { Divide } from 'lucide-react';

export default function MultiplicationDivisionTab() {
  const [section, setSection] = useState('study');

  return (
    <div className="speedmath-subtab">
      <div className="speedmath-subtab__nav">
        <button className={`speedmath-subtab__btn ${section === 'study' ? 'active' : ''}`} onClick={() => setSection('study')}>Study</button>
        <button className={`speedmath-subtab__btn ${section === 'practice' ? 'active' : ''}`} onClick={() => setSection('practice')}>Practice</button>
      </div>
      <div className="speedmath-subtab__body">
        {section === 'study' ? (
          <div className="tab-empty"><Divide size={36} /><p>No multiplication &amp; division content yet.</p></div>
        ) : (
          <div className="tab-empty"><Divide size={36} /><p>No multiplication &amp; division practice yet.</p></div>
        )}
      </div>
    </div>
  );
}
