import { Bell, Sun, LayoutDashboard, Ruler } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';
import PreferenceToggleGroup from '../components/PreferenceToggleGroup';

const NOTIFICATION_ITEMS = [
  { key: 'notif_tasks',         label: 'Tasks' },
  { key: 'notif_study',         label: 'Study Reminders' },
  { key: 'notif_exam',          label: 'Exam Reminders' },
  { key: 'notif_mock_test',     label: 'Mock Test Reminders' },
  { key: 'notif_shopping',      label: 'Shopping Reminders' },
  { key: 'notif_budget',        label: 'Budget Reminders' },
  { key: 'notif_career',        label: 'Career Updates' },
  { key: 'notif_announcements', label: 'Announcements' },
];

const THEME_OPTIONS     = ['light', 'dark', 'system'];
const DASHBOARD_OPTIONS = ['overview', 'study', 'todo', 'health'];
const UNIT_OPTIONS      = ['metric', 'imperial'];

export default function PreferencesTab() {
  const { prefs, loading, updatePrefs } = usePreferences();

  if (loading) return <p className="settings-loading">Loading…</p>;

  const set = (key, value) => updatePrefs({ [key]: value });

  return (
    <div className="settings-tab">

      {/* Notifications */}
      <div className="settings-card">
        <h4 className="settings-section-title"><Bell size={15} /> Notifications</h4>
        <p className="settings-meta">Choose which reminders and alerts you want to receive.</p>
        <PreferenceToggleGroup
          items={NOTIFICATION_ITEMS}
          values={prefs || {}}
          onChange={set}
        />
      </div>

      {/* Theme */}
      <div className="settings-card">
        <h4 className="settings-section-title"><Sun size={15} /> Theme</h4>
        <div className="pref-option-group">
          {THEME_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`pref-option-btn ${prefs?.theme === opt ? 'pref-option-btn--active' : ''}`}
              onClick={() => set('theme', opt)}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Default dashboard */}
      <div className="settings-card">
        <h4 className="settings-section-title"><LayoutDashboard size={15} /> Default Dashboard View</h4>
        <p className="settings-meta">The first page you see after logging in.</p>
        <div className="pref-option-group">
          {DASHBOARD_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`pref-option-btn ${prefs?.defaultDashboard === opt ? 'pref-option-btn--active' : ''}`}
              onClick={() => set('defaultDashboard', opt)}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Units */}
      <div className="settings-card">
        <h4 className="settings-section-title"><Ruler size={15} /> Measurement Units</h4>
        <p className="settings-meta">Used in the Health module for weight, height, distance.</p>
        <div className="pref-option-group">
          {UNIT_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`pref-option-btn ${prefs?.units === opt ? 'pref-option-btn--active' : ''}`}
              onClick={() => set('units', opt)}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
