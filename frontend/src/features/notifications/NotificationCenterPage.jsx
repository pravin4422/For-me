import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCheck, SlidersHorizontal } from 'lucide-react';
import { useNotificationContext } from './context/NotificationContext';
import NotificationItem from './components/NotificationItem';
import NotificationFilterTabs from './components/NotificationFilterTabs';
import NotificationSettingsPanel from './components/NotificationSettingsPanel';
import EmptyNotifications from './components/EmptyNotifications';
import './NotificationCenterPage.css';

export default function NotificationCenterPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSettings, setShowSettings]     = useState(false);
  const observerRef = useRef(null);

  const {
    notifications: allNotifications, loading, hasMore,
    markAsRead, markAllAsRead, deleteNotification, fetchMore,
  } = useNotificationContext();

  // Filter locally by category — no extra API call needed
  const notifications = activeCategory
    ? allNotifications.filter(n => n.category === activeCategory)
    : allNotifications;

  // Infinite scroll sentinel — loads more from server when all items are shown
  const sentinelRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) fetchMore(false, 2);
    });
    observerRef.current.observe(node);
  }, [hasMore, loading, fetchMore]);

  return (
    <div className="notif-center">
      <div className="notif-center__header">
        <h2 className="notif-center__title" onClick={() => { setActiveCategory(null); setShowSettings(false); navigate('/dashboard/notifications'); }} style={{ cursor: 'pointer' }}>Notifications</h2>
        <div className="notif-center__actions">
          <button className="notif-center__btn" onClick={markAllAsRead}>
            <CheckCheck size={15} /> Mark all read
          </button>
          <button
            className={`notif-center__btn${showSettings ? ' notif-center__btn--active' : ''}`}
            onClick={() => setShowSettings(v => !v)}
          >
            <SlidersHorizontal size={15} /> Preferences
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="notif-center__settings-wrap">
          <NotificationSettingsPanel />
        </div>
      )}

      <NotificationFilterTabs active={activeCategory} onChange={setActiveCategory} />

      <div className="notif-center__list">
        {loading && notifications.length === 0
          ? <p className="notif-center__loading">Loading...</p>
          : notifications.length === 0
            ? <EmptyNotifications />
            : notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
        }
        {loading && notifications.length > 0 && <p className="notif-center__loading">Loading more...</p>}
        {hasMore && !loading && <div ref={sentinelRef} className="notif-center__sentinel" />}
      </div>
    </div>
  );
}
