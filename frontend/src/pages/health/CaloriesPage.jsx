import { useState } from 'react';
import { Flame, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import HealthTrackerCard from '../../components/health/HealthTrackerCard';
import './health.css';

const GOAL         = 2000;
const YESTERDAY    = 1880;
const todayLabel   = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function CaloriesPage() {
  const [calories, setCalories] = useState(1640);
  const [input, setInput]       = useState('');

  const add = () => { const v = parseInt(input); if (v > 0) { setCalories(c => c + v); setInput(''); } };

  const delta = calories - YESTERDAY;

  return (
    <div className="health-page">
      <div className="health-header"><div>
        <h1 className="health-title">Calories</h1>
        <p className="health-date">{todayLabel}</p>
      </div></div>
      <div className="health-grid">
        <HealthTrackerCard icon={<Flame size={20} />} iconColor="#5f59f7"
          label="Calories" value={`${calories.toLocaleString()} kcal`} goal={`${GOAL.toLocaleString()} kcal`}
          pct={Math.min(calories / GOAL, 1)} ringColor="#5f59f7" isEmpty={calories === 0}>
          <div className="htc-log-row">
            <input className="htc-input" type="number" min="0" step="50"
              placeholder="Add kcal (e.g. 350)" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()} />
            <button className="htc-add-btn" style={{ background: '#5f59f7' }} onClick={add}><Plus size={14} /> Add</button>
          </div>
          <div className="htc-quick-btns">
            {[100, 200, 300, 500].map(v => (
              <button key={v} className="htc-quick" style={{ borderColor: '#5f59f7', color: '#5f59f7' }}
                onClick={() => setCalories(c => c + v)}>+{v}</button>
            ))}
          </div>
          <div className={`cal-delta ${delta > 0 ? 'cal-delta--up' : 'cal-delta--down'}`}>
            {delta > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{delta > 0 ? '+' : ''}{delta} kcal vs yesterday ({YESTERDAY} kcal)</span>
          </div>
        </HealthTrackerCard>
      </div>
    </div>
  );
}
