export default function PreferenceToggleGroup({ title, items, values, onChange }) {
  return (
    <div className="pref-group">
      {title && <h4 className="settings-section-title">{title}</h4>}
      {items.map(({ key, label }) => (
        <label key={key} className="pref-toggle-row">
          <span className="pref-toggle-label">{label}</span>
          <div
            className={`toggle ${values[key] ? 'toggle--on' : ''}`}
            onClick={() => onChange(key, !values[key])}
            role="switch"
            aria-checked={!!values[key]}
          >
            <div className="toggle-thumb" />
          </div>
        </label>
      ))}
    </div>
  );
}
