import { NotificationCategory, CATEGORY_META } from '../notificationConfig';
import './NotificationFilterTabs.css';

const ALL_TAB = { key: null, label: 'All' };

const TABS = [
  ALL_TAB,
  ...Object.values(NotificationCategory).map(c => ({
    key: c,
    label: CATEGORY_META[c].label,
  })),
];

export default function NotificationFilterTabs({ active, onChange }) {
  return (
    <div className="notif-filter-tabs">
      {TABS.map(tab => (
        <button
          key={tab.key ?? 'all'}
          className={`notif-filter-tab${active === tab.key ? ' notif-filter-tab--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
