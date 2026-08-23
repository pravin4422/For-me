import { BellOff } from 'lucide-react';
import './EmptyNotifications.css';

export default function EmptyNotifications({ message = 'No notifications yet' }) {
  return (
    <div className="notif-empty">
      <BellOff size={36} className="notif-empty__icon" />
      <p className="notif-empty__text">{message}</p>
    </div>
  );
}
