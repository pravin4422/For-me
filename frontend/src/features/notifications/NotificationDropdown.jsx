import { Link } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';
import { useNotificationContext } from './context/NotificationContext';
import NotificationItem from './components/NotificationItem';
import EmptyNotifications from './components/EmptyNotifications';
import './NotificationDropdown.css';

export default function NotificationDropdown({ onClose }) {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotificationContext();

  return (
    <div className="notif-dropdown">
      <div className="notif-dropdown__header">
        <span className="notif-dropdown__title">Notifications</span>
        <button className="notif-dropdown__mark-all" onClick={markAllAsRead}>
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="notif-dropdown__list">
        {loading && notifications.length === 0
          ? null
          : notifications.length === 0
            ? <EmptyNotifications message="You're all caught up!" />
            : notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
        }
      </div>

      <Link to="/dashboard/notifications" className="notif-dropdown__view-all" onClick={onClose}>
        View all notifications
      </Link>
    </div>
  );
}
