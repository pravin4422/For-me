import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationContext } from './context/NotificationContext';
import NotificationDrawer from './NotificationDrawer';
import './NotificationBell.css';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notif = useNotificationContext();

  return (
    <>
      <button
        className="notif-bell"
        aria-label="Notifications"
        onClick={() => setOpen(true)}
      >
        <Bell size={18} />
        {notif.unreadCount > 0 && (
          <span className="notif-bell__badge">
            {notif.unreadCount > 99 ? '99+' : notif.unreadCount}
          </span>
        )}
      </button>

      <NotificationDrawer open={open} onClose={() => setOpen(false)} notif={notif} />
    </>
  );
}
