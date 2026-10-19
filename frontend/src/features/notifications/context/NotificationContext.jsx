import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../../../api/axios/axiosInstance';

const NotificationContext = createContext(null);

const POLL_INTERVAL = 30000;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [hasMore, setHasMore]             = useState(false);
  const pollRef = useRef(null);

  const fetchNotifications = useCallback(async (reset = false, page = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/notifications', { params: { page, limit: 50 } });
      const items = data.items ?? data.data ?? [];
      setNotifications(prev => reset ? items : [...prev, ...items]);
      setUnreadCount(data.unreadCount ?? 0);
      setHasMore(data.hasMore ?? false);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(true);
    pollRef.current = setInterval(() => fetchNotifications(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchNotifications]);

  const addFromReminder = useCallback(async (notif) => {
    try {
      const { data } = await axiosInstance.post('/notifications', {
        type:     notif.type     || 'reminder',
        category: notif.category || 'Task',
        title:    notif.title,
        body:     notif.body    || '',
        taskId:   notif.taskId  || null,
      });
      setNotifications(prev => [data.data, ...prev]);
      setUnreadCount(c => c + 1);
    } catch {
      const local = { id: `local-${Date.now()}`, read: false, createdAt: new Date().toISOString(), ...notif };
      setNotifications(prev => [local, ...prev]);
      setUnreadCount(c => c + 1);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => addFromReminder(e.detail);
    window.addEventListener('app:notification', handler);
    return () => window.removeEventListener('app:notification', handler);
  }, [addFromReminder]);

  const addLocal = useCallback((notif) => {
    const newNotif = { id: `local-${Date.now()}`, read: false, createdAt: new Date().toISOString(), ...notif };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(c => c + 1);
  }, []);

  const markAsRead = useCallback(async (id) => {
    try { await axiosInstance.patch(`/notifications/${id}/read`); } catch {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  }, []);

  const markAsUnread = useCallback(async (id) => {
    try { await axiosInstance.patch(`/notifications/${id}/unread`); } catch {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    setUnreadCount(c => c + 1);
  }, []);

  const markAllAsRead = useCallback(async () => {
    try { await axiosInstance.patch('/notifications/read-all'); } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try { await axiosInstance.delete(`/notifications/${id}`); } catch {}
    setNotifications(prev => {
      const removed = prev.find(n => n.id === id);
      if (removed && !removed.read) setUnreadCount(c => Math.max(0, c - 1));
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const clearAll = useCallback(async () => {
    try { await axiosInstance.delete('/notifications'); } catch {}
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, loading, hasMore,
      fetchMore: fetchNotifications,
      addLocal, addFromReminder,
      markAsRead, markAsUnread, markAllAsRead,
      deleteNotification, clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => useContext(NotificationContext);
