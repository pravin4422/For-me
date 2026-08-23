import './SectionTabs.css';

export default function SectionTabs({ sections, activeSection, onSwitch }) {
  if (!sections?.length) return null;
  return (
    <div className="section-tabs">
      {sections.map(sec => (
        <button
          key={sec.id}
          className={`section-tab${activeSection === sec.id ? ' active' : ''}`}
          onClick={() => onSwitch(sec.id)}
        >
          {sec.name}
          <span className="sec-count">{sec.questionCount}Q</span>
        </button>
      ))}
    </div>
  );
}
