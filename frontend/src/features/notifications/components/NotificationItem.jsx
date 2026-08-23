import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { CATEGORY_META } from '../notificationConfig';
import './NotificationItem.css';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const navigate = useNavigate();
  const { id, category, title, message, timestamp, read, actionLabel, actionPath } = notification;
  const meta = CATEGORY_META[category] ?? CATEGORY_META['Announcement'];
  const Icon = meta.icon;

  const handleClick = () => {
    if (!read) onMarkRead?.(id);
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (!read) onMarkRead?.(id);
    if (actionPath) navigate(actionPath);
  };

  return (
    <div
      className={`notif-item${read ? '' : ' notif-item--unread'}`}
      onClick={handleClick}
    >
      <span className="notif-item__icon" style={{ background: `${meta.color}18`, color: meta.color }}>
        <Icon size={16} />
      </span>

      <div className="notif-item__body">
        <p className="notif-item__title">{title}</p>
        <p className="notif-item__msg">{message}</p>
        <div className="notif-item__footer">
          <span className="notif-item__time">{timeAgo(timestamp)}</span>
          {actionLabel && actionPath && (
            <button className="notif-item__action" style={{ color: meta.color }} onClick={handleAction}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      <button
        className="notif-item__delete"
        onClick={e => { e.stopPropagation(); onDelete?.(id); }}
        aria-label="Delete"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
