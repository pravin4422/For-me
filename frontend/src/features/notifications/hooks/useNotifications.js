import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../../../api/axios/axiosInstance';

const POLL_INTERVAL = 30000;

export function useNotifications({ category = null, page = 1, limit = 20 } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [hasMore, setHasMore]             = useState(false);
  const pollRef = useRef(null);

  const fetchNotifications = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const params = { page: reset ? 1 : page, limit };
      if (category) params.category = category;
      const { data } = await axiosInstance.get('/notifications', { params });
      const items = data.items ?? data.data ?? [];
      setNotifications(prev => reset ? items : [...prev, ...items]);
      setUnreadCount(data.unreadCount ?? 0);
      setHasMore(data.hasMore ?? false);
    } catch {
      // silently fail — local state still works
    } finally {
      setLoading(false);
    }
  }, [category, page, limit]);

  useEffect(() => {
    fetchNotifications(true);
    pollRef.current = setInterval(() => fetchNotifications(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [category]);

  const addLocal = useCallback((notif) => {
    const newNotif = { id: `local-${Date.now()}`, read: false, timestamp: new Date().toISOString(), ...notif };
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

  return {
    notifications, unreadCount, loading, hasMore,
    fetchMore: fetchNotifications,
    addLocal,
    markAsRead, markAsUnread, markAllAsRead,
    deleteNotification, clearAll,
  };
}
