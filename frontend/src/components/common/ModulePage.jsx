import './ModulePage.css';

export default function ModulePage({ title, icon, description }) {
  return (
    <div className="module-empty">
      <div className="module-empty-icon">{icon}</div>
      <h2 className="module-empty-title">{title}</h2>
      <p className="module-empty-desc">{description || `No data yet — start adding your ${title.toLowerCase()} here.`}</p>
    </div>
  );
}
