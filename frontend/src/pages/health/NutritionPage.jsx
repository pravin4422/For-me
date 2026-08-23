import { useState } from 'react';
import { Utensils, Plus } from 'lucide-react';
import HealthTrackerCard from '../../components/health/HealthTrackerCard';
import './health.css';

const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function NutritionPage() {
  const [meals, setMeals] = useState([
    { name: 'Oats + Banana', protein: 12, notes: 'Breakfast' },
    { name: 'Grilled Chicken Rice', protein: 38, notes: 'Lunch' },
  ]);
  const [name, setName]       = useState('');
  const [protein, setProtein] = useState('');
  const [notes, setNotes]     = useState('');

  const add = () => {
    if (name) { setMeals(m => [...m, { name, protein: parseInt(protein) || 0, notes }]); setName(''); setProtein(''); setNotes(''); }
  };

  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);

  return (
    <div className="health-page">
      <div className="health-header"><div>
        <h1 className="health-title">Food / Nutrition</h1>
        <p className="health-date">{todayLabel}</p>
      </div></div>
      <div className="health-grid">
        <HealthTrackerCard icon={<Utensils size={20} />} iconColor="#6592fd"
          label="Food / Nutrition"
          value={meals.length > 0 ? `${meals.length} meal${meals.length > 1 ? 's' : ''} · ${totalProtein}g protein` : '—'}
          goal="Balanced meals"
          pct={Math.min(totalProtein / 100, 1)} ringColor="#6592fd" isEmpty={meals.length === 0}>
          <div className="htc-log-row htc-log-row--workout">
            <input className="htc-input" type="text" placeholder="Meal name" value={name} onChange={e => setName(e.target.value)} />
            <input className="htc-input htc-input--sm" type="number" min="0" placeholder="Protein g" value={protein} onChange={e => setProtein(e.target.value)} />
            <input className="htc-input" type="text" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
            <button className="htc-add-btn" style={{ background: '#6592fd' }} onClick={add}><Plus size={14} /> Add</button>
          </div>
          {meals.length > 0 && (
            <ul className="workout-log-list">
              {meals.map((m, i) => (
                <li key={i} className="workout-log-item">
                  <span className="workout-dot" style={{ background: '#6592fd' }} />
                  <span className="workout-type">{m.name}</span>
                  {m.protein > 0 && <span className="workout-dur">{m.protein}g protein</span>}
                  {m.notes && <span className="meal-note">{m.notes}</span>}
                </li>
              ))}
            </ul>
          )}
        </HealthTrackerCard>
      </div>
    </div>
  );
}
