import { useState } from 'react';
import { Sigma } from 'lucide-react';

export default function SquareCubeTab() {
  const [section, setSection] = useState('study');

  return (
    <div className="speedmath-subtab">
      <div className="speedmath-subtab__nav">
        <button className={`speedmath-subtab__btn ${section === 'study' ? 'active' : ''}`} onClick={() => setSection('study')}>Study</button>
        <button className={`speedmath-subtab__btn ${section === 'practice' ? 'active' : ''}`} onClick={() => setSection('practice')}>Practice</button>
      </div>
      <div className="speedmath-subtab__body">
        {section === 'study' ? (
          <div className="tab-empty"><Sigma size={36} /><p>No squares &amp; cubes content yet.</p></div>
        ) : (
          <div className="tab-empty"><Sigma size={36} /><p>No squares &amp; cubes practice yet.</p></div>
        )}
      </div>
    </div>
  );
}
