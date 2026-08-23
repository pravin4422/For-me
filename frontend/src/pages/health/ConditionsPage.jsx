import { useState } from 'react';
import { Plus, Stethoscope, Activity } from 'lucide-react';
import ConditionTrackerCard from '../../components/health/ConditionTrackerCard';
import './health.css';

const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const INIT_CONDITIONS = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    color: '#5f59f7',
    nextCheckup: '15 Jul 2025',
    metrics: [
      { key: 'fasting',  label: 'Fasting Sugar',  unit: 'mg/dL', placeholder: 'e.g. 95',  range: { low: 70, high: 100 } },
      { key: 'postmeal', label: 'Post-meal Sugar', unit: 'mg/dL', placeholder: 'e.g. 130', range: { low: 70, high: 140 } },
      { key: 'hba1c',    label: 'HbA1c',           unit: '%',     placeholder: 'e.g. 5.8',  range: { low: 4,  high: 5.7 } },
    ],
    logs: [
      { date: '01 Jun', time: '08:00 AM', fasting: 92,  postmeal: 128, hba1c: '',  note: 'Morning reading' },
      { date: '03 Jun', time: '08:15 AM', fasting: 98,  postmeal: 135, hba1c: '',  note: '' },
      { date: '05 Jun', time: '07:50 AM', fasting: 88,  postmeal: 122, hba1c: '',  note: 'After walk' },
      { date: '08 Jun', time: '08:00 AM', fasting: 105, postmeal: 148, hba1c: '',  note: 'Skipped dinner' },
      { date: '10 Jun', time: '08:30 AM', fasting: 94,  postmeal: 130, hba1c: 5.8, note: 'Lab test' },
      { date: '12 Jun', time: '08:00 AM', fasting: 90,  postmeal: 125, hba1c: '',  note: '' },
      { date: '15 Jun', time: '08:10 AM', fasting: 96,  postmeal: 132, hba1c: '',  note: '' },
    ],
    dietGuide: {
      eat:   ['Leafy greens', 'Whole grains', 'Legumes', 'Nuts & seeds', 'Berries', 'Fish', 'Eggs'],
      avoid: ['White rice', 'Sugary drinks', 'White bread', 'Sweets', 'Fried foods', 'Alcohol'],
    },
    conditionMeals: [
      { name: 'Brown rice + dal', cal: 320, carbs: 52, flagged: false },
      { name: 'Sugary tea',       cal: 80,  carbs: 18, flagged: true  },
    ],
    labReports: [
      { name: 'HbA1c Report Jun 2025', date: '10 Jun 2025' },
    ],
  },
];

export default function ConditionsPage() {
  const [conditions, setConditions]         = useState(INIT_CONDITIONS);
  const [showAdd, setShowAdd]               = useState(false);
  const [newName, setNewName]               = useState('');
  const [newColor, setNewColor]             = useState('#5f59f7');

  const updateCondition = (id, patch) =>
    setConditions(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));

  const addCondition = () => {
    if (!newName.trim()) return;
    setConditions(prev => [...prev, {
      id: Date.now().toString(),
      name: newName.trim(),
      color: newColor,
      metrics: [], logs: [],
      dietGuide: { eat: [], avoid: [] },
      conditionMeals: [], labReports: [],
    }]);
    setNewName(''); setShowAdd(false);
  };

  return (
    <div className="health-page">
      <div className="health-header">
        <div>
          <h1 className="health-title">Medical Conditions</h1>
          <p className="health-date">{todayLabel}</p>
        </div>
      </div>

      <div className="health-section-card">
        <div className="health-section-header">
          <span className="health-section-icon" style={{ color: '#343090', background: '#34309018' }}>
            <Stethoscope size={18} />
          </span>
          <span className="health-section-title">Conditions &amp; Checkups</span>
          <button className="htc-add-btn" style={{ background: '#343090' }} onClick={() => setShowAdd(s => !s)}>
            <Plus size={13} /> Add Condition
          </button>
        </div>

        {/* Upcoming checkups strip */}
        {conditions.filter(c => c.nextCheckup).length > 0 && (
          <div className="medical-checkup-strip">
            {conditions.filter(c => c.nextCheckup).map(c => (
              <div key={c.id} className="medical-checkup-badge" style={{ borderColor: c.color }}>
                <Activity size={13} style={{ color: c.color }} />
                <span className="medical-checkup-name">{c.name}</span>
                <span className="medical-checkup-date" style={{ color: c.color }}>{c.nextCheckup}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        {showAdd && (
          <div className="medical-add-form">
            <input className="htc-input" type="text" placeholder="Condition name (e.g. Blood Pressure)"
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCondition()} />
            <div className="medical-color-row">
              {['#5f59f7', '#44c2fd', '#6592fd', '#8c61ff', '#343090'].map(col => (
                <button key={col}
                  className={`medical-color-dot ${newColor === col ? 'medical-color-dot--active' : ''}`}
                  style={{ background: col }} onClick={() => setNewColor(col)} />
              ))}
            </div>
            <button className="htc-add-btn" style={{ background: '#343090' }} onClick={addCondition}>
              <Plus size={13} /> Save
            </button>
          </div>
        )}

        {conditions.length === 0 && (
          <p className="ctc-empty-chart">No conditions tracked yet — add one above.</p>
        )}

        <div className="medical-conditions-list">
          {conditions.map(c => (
            <ConditionTrackerCard key={c.id} condition={c} onUpdate={updateCondition} />
          ))}
        </div>
      </div>
    </div>
  );
}
