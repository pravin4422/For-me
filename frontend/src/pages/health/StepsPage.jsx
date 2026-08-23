import { useState } from 'react';
import { Footprints, Plus } from 'lucide-react';
import HealthTrackerCard from '../../components/health/HealthTrackerCard';
import './health.css';

const GOAL = 10000;
const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function StepsPage() {
  const [steps, setSteps] = useState(7200);
  const [input, setInput] = useState('');

  const add = () => { const v = parseInt(input); if (v > 0) { setSteps(s => s + v); setInput(''); } };

  return (
    <div className="health-page">
      <div className="health-header"><div>
        <h1 className="health-title">Steps / Travel</h1>
        <p className="health-date">{todayLabel}</p>
      </div></div>
      <div className="health-grid">
        <HealthTrackerCard icon={<Footprints size={20} />} iconColor="#6592fd"
          label="Steps" value={`${steps.toLocaleString()} steps`} goal={`${GOAL.toLocaleString()} steps`}
          pct={Math.min(steps / GOAL, 1)} ringColor="#6592fd" isEmpty={steps === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0" step="100"
              placeholder="Steps (e.g. 1000)" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()} />
            <button className="htc-add-btn" style={{ background: '#6592fd' }} onClick={add}><Plus size={14} /> Add</button>
          </div>
          <div className="htc-quick-btns">
            {[500, 1000, 2000, 5000].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#6592fd', color: '#6592fd' }}
                onClick={() => setSteps(s => s + v)}>+{v >= 1000 ? `${v/1000}k` : v}</button>
            ))}
          </div>
        </HealthTrackerCard>
      </div>
    </div>
  );
}
