import { useState } from 'react';
import { Droplets, Plus } from 'lucide-react';
import HealthTrackerCard from '../../components/health/HealthTrackerCard';
import './health.css';

const GOAL = 8;
const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function WaterPage() {
  const [water, setWater] = useState(5);
  const [input, setInput] = useState('');

  const add = () => { const v = parseFloat(input); if (v > 0) { setWater(w => +(w + v).toFixed(1)); setInput(''); } };

  return (
    <div className="health-page">
      <div className="health-header"><div>
        <h1 className="health-title">Water Intake</h1>
        <p className="health-date">{todayLabel}</p>
      </div></div>
      <div className="health-grid">
        <HealthTrackerCard icon={<Droplets size={20} />} iconColor="#44c2fd"
          label="Water Intake" value={`${water} glasses`} goal={`${GOAL} glasses`}
          pct={Math.min(water / GOAL, 1)} ringColor="#44c2fd" isEmpty={water === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0.5" step="0.5"
              placeholder="Glasses (e.g. 1)" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()} />
            <button className="htc-add-btn" style={{ background: '#44c2fd' }} onClick={add}><Plus size={14} /> Add</button>
          </div>
          <div className="htc-quick-btns">
            {[0.5, 1, 2].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#44c2fd', color: '#44c2fd' }}
                onClick={() => setWater(w => +(w + v).toFixed(1))}>+{v} gl</button>
            ))}
          </div>
        </HealthTrackerCard>
      </div>
    </div>
  );
}
