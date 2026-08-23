import { useState, useEffect } from 'react';

export function useStudyData() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    // replace with real API call
    setLoading(false);
    setData({});
  }, []);

  return { data, loading, error };
}
