import { NotificationCategory, CATEGORY_META } from '../notificationConfig';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import './NotificationSettingsPanel.css';

export default function NotificationSettingsPanel() {
  const { settings, loading, updateSetting } = useNotificationSettings();

  return (
    <div className="notif-settings">
      <h3 className="notif-settings__title">Notification Preferences</h3>
      <p className="notif-settings__sub">Choose which notifications you want to receive.</p>

      <div className="notif-settings__list">
        {Object.values(NotificationCategory).map(cat => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          return (
            <div key={cat} className="notif-settings__row">
              <span className="notif-settings__icon" style={{ color: meta.color }}>
                <Icon size={16} />
              </span>
              <span className="notif-settings__label">{meta.label}</span>
              <label className="notif-settings__toggle">
                <input
                  type="checkbox"
                  checked={settings[cat] ?? true}
                  disabled={loading}
                  onChange={e => updateSetting(cat, e.target.checked)}
                />
                <span className="notif-settings__slider" />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
