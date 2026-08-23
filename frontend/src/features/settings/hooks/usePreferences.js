import { useState } from 'react';

const MOCK = {
  theme: 'light',
  defaultDashboard: 'overview',
  units: 'metric',
  notif_tasks: true,
  notif_study: true,
  notif_exam: true,
  notif_mock_test: false,
  notif_shopping: false,
  notif_budget: true,
  notif_career: false,
  notif_announcements: true,
};

export function usePreferences() {
  const [prefs, setPrefs] = useState(MOCK);
  const [loading] = useState(false);

  const updatePrefs = async (patch) => setPrefs(p => ({ ...p, ...patch }));

  return { prefs, loading, error: null, updatePrefs };
}
