import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../api/axios/axiosInstance';
import { NotificationCategory } from '../notificationConfig';

const DEFAULT_SETTINGS = Object.fromEntries(
  Object.values(NotificationCategory).map(c => [c, true])
);

export function useNotificationSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/notifications/settings')
      .then(({ data }) => setSettings({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = useCallback(async (category, enabled) => {
    setSettings(prev => ({ ...prev, [category]: enabled }));
    try {
      await axiosInstance.patch('/notifications/settings', { category, enabled });
    } catch {
      setSettings(prev => ({ ...prev, [category]: !enabled })); // rollback
    }
  }, []);

  return { settings, loading, updateSetting };
}
