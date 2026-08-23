const EXPORT_TYPES = [
  { key: 'study_progress',      label: 'Study Progress' },
  { key: 'mock_test_results',   label: 'Mock Test Results' },
  { key: 'weak_topic_analysis', label: 'Weak Topic Analysis' },
  { key: 'budget',              label: 'Budget' },
  { key: 'time_tracking',       label: 'Time Tracking' },
  { key: 'health_tracking',     label: 'Health Tracking' },
  { key: 'todo_history',        label: 'To-Do History' },
];

export default function ExportSelectionList({ selected, onChange }) {
  const toggle = (key) =>
    onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]);

  return (
    <div className="export-list">
      {EXPORT_TYPES.map(({ key, label }) => (
        <label key={key} className="export-list-item">
          <input
            type="checkbox"
            checked={selected.includes(key)}
            onChange={() => toggle(key)}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}
