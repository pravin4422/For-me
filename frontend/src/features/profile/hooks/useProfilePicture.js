import { useState } from 'react';
import api from '../../../api/axios/axiosInstance';

export function useProfilePicture(setProfile) {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const uploadPicture = async (file) => {
    setUploading(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('picture', file);
      const r = await api.post('/settings/profile/picture', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setProfile(p => ({ ...p, pictureUrl: r.data.pictureUrl, pictureRef: r.data.pictureRef }));
      return r.data;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removePicture = async () => {
    await api.delete('/settings/profile/picture');
    setProfile(p => ({ ...p, pictureUrl: null, pictureRef: null }));
  };

  return { uploading, progress, uploadPicture, removePicture };
}
