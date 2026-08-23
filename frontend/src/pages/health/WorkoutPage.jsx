import { useState } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import HealthTrackerCard from '../../components/health/HealthTrackerCard';
import './health.css';

const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([{ type: 'Running', duration: 30 }]);
  const [type, setType] = useState('');
  const [dur, setDur]   = useState('');

  const add = () => {
    if (type && dur) { setWorkouts(w => [...w, { type, duration: parseInt(dur) }]); setType(''); setDur(''); }
  };

  return (
    <div className="health-page">
      <div className="health-header"><div>
        <h1 className="health-title">Workout</h1>
        <p className="health-date">{todayLabel}</p>
      </div></div>
      <div className="health-grid">
        <HealthTrackerCard icon={<Dumbbell size={20} />} iconColor="#5f59f7"
          label="Workout"
          value={workouts.length > 0 ? `${workouts.length} session${workouts.length > 1 ? 's' : ''}` : '—'}
          goal="Daily activity"
          pct={Math.min(workouts.length / 2, 1)} ringColor="#5f59f7" isEmpty={workouts.length === 0}>
          <div className="htc-log-row htc-log-row--workout">
            <input className="htc-input" type="text" placeholder="Type (e.g. Running)"
              value={type} onChange={e => setType(e.target.value)} />
            <input className="htc-input htc-input--sm" type="number" min="1" placeholder="Min"
              value={dur} onChange={e => setDur(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()} />
            <button className="htc-add-btn" style={{ background: '#5f59f7' }} onClick={add}><Plus size={14} /> Log</button>
          </div>
          {workouts.length > 0 && (
            <ul className="workout-log-list">
              {workouts.map((w, i) => (
                <li key={i} className="workout-log-item">
                  <span className="workout-dot" style={{ background: '#5f59f7' }} />
                  <span className="workout-type">{w.type}</span>
                  <span className="workout-dur">{w.duration} min</span>
                </li>
              ))}
            </ul>
          )}
        </HealthTrackerCard>
      </div>
    </div>
  );
}
