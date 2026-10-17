import { useEffect, useState } from 'react';
import { X, Plus, ChevronUp } from 'lucide-react';
import NotificationItem from './components/NotificationItem';
import EmptyNotifications from './components/EmptyNotifications';
import { NotificationCategory, CATEGORY_META } from './notificationConfig';
import './NotificationDrawer.css';

const CATEGORIES = Object.keys(NotificationCategory);

export default function NotificationDrawer({ open, onClose, notif }) {
  const { notifications = [], loading, markAsRead, deleteNotification, clearAll, addLocal } = notif;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', category: 'Announcement' });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleCreate = () => {
    if (!form.title.trim()) return;
    addLocal({ title: form.title.trim(), message: form.message.trim(), category: form.category });
    setForm({ title: '', message: '', category: 'Announcement' });
    setShowForm(false);
  };

  return (
    <>
      <div className={`nd-backdrop${open ? ' nd-backdrop--visible' : ''}`} onClick={onClose} />
      <aside className={`nd-drawer${open ? ' nd-drawer--open' : ''}`} aria-label="Notifications">
        <div className="nd-header">
          <span className="nd-title">Notifications</span>
          <div className="nd-header-actions">
            {notifications.length > 0 && (
              <button className="nd-clear-all" onClick={clearAll}>Clear All</button>
            )}
            <button className="nd-icon-btn" onClick={() => setShowForm(v => !v)} aria-label="Create notification">
              {showForm ? <ChevronUp size={16} /> : <Plus size={16} />}
            </button>
            <button className="nd-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {showForm && (
          <div className="nd-create-form">
            <select
              className="nd-input"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_META[c].label}</option>
              ))}
            </select>
            <input
              className="nd-input"
              placeholder="Title *"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <textarea
              className="nd-input nd-textarea"
              placeholder="Message (optional)"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
            <button className="nd-create-btn" onClick={handleCreate} disabled={!form.title.trim()}>
              Add Notification
            </button>
          </div>
        )}

        <div className="nd-list">
          {loading && notifications.length === 0
            ? null
            : notifications.length === 0
              ? <EmptyNotifications message="No new notifications" />
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
      </aside>
    </>
  );
}
