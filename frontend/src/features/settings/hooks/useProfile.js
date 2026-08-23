import { useState } from 'react';

const MOCK = { name: 'My Account', email: 'user@example.com', phone: '', bio: '', avatarUrl: '' };

export function useProfile() {
  const [profile, setProfile] = useState(MOCK);
  const [loading] = useState(false);

  const updateProfile = async (data) => setProfile(p => ({ ...p, ...data }));
  const uploadAvatar  = async (file) => {
    const url = URL.createObjectURL(file);
    setProfile(p => ({ ...p, avatarUrl: url }));
  };

  return { profile, loading, error: null, updateProfile, uploadAvatar };
}
