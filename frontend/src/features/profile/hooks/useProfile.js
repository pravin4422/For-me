import { useState, useEffect } from 'react';
import api from '../../../api/axios/axiosInstance';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    api.get('/settings/profile')
      .then(r => setProfile(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateProfile = async (data) => {
    setSaving(true);
    try {
      const r = await api.patch('/settings/profile', data);
      setProfile(r.data);
      return r.data;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, error, updateProfile, setProfile };
}
