import { useState } from 'react';
import { Moon, Check } from 'lucide-react';
import HealthTrackerCard from '../../components/health/HealthTrackerCard';
import './health.css';

const GOAL = 8;
const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function SleepPage() {
  const [sleep, setSleep] = useState(6.5);
  const [input, setInput] = useState('');

  const set = () => { const v = parseFloat(input); if (v > 0) { setSleep(+(v).toFixed(1)); setInput(''); } };

  return (
    <div className="health-page">
      <div className="health-header"><div>
        <h1 className="health-title">Sleep Hours</h1>
        <p className="health-date">{todayLabel}</p>
      </div></div>
      <div className="health-grid">
        <HealthTrackerCard icon={<Moon size={20} />} iconColor="#8c61ff"
          label="Sleep" value={`${sleep} hrs`} goal={`${GOAL} hrs`}
          pct={Math.min(sleep / GOAL, 1)} ringColor="#8c61ff" isEmpty={sleep === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0" max="24" step="0.5"
              placeholder="Hours slept (e.g. 7.5)" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && set()} />
            <button className="htc-add-btn" style={{ background: '#8c61ff' }} onClick={set}><Check size={14} /> Set</button>
          </div>
          <div className="htc-quick-btns">
            {[6, 7, 7.5, 8].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#8c61ff', color: '#8c61ff' }}
                onClick={() => setSleep(v)}>{v}h</button>
            ))}
          </div>
        </HealthTrackerCard>
      </div>
    </div>
  );
}
