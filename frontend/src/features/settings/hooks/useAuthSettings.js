import { useState } from 'react';

const MOCK = { providers: ['password'], otpEnabled: false };

export function useAuthSettings() {
  const [authInfo, setAuthInfo] = useState(MOCK);
  const [loading] = useState(false);

  const changePassword = async () => {};
  const toggleOtp      = async (enabled) => setAuthInfo(p => ({ ...p, otpEnabled: enabled }));
  const linkGoogle     = async () => setAuthInfo(p => ({ ...p, providers: [...p.providers, 'google.com'] }));
  const unlinkGoogle   = async () => setAuthInfo(p => ({ ...p, providers: p.providers.filter(x => x !== 'google.com') }));

  return { authInfo, loading, error: null, changePassword, toggleOtp, linkGoogle, unlinkGoogle };
}
