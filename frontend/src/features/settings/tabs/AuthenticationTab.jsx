import { Shield, Link, Unlink, Mail, Globe } from 'lucide-react';
import { useAuthSettings } from '../hooks/useAuthSettings';
import PasswordChangeForm from '../components/PasswordChangeForm';

export default function AuthenticationTab() {
  const { authInfo, loading, changePassword, toggleOtp, linkGoogle, unlinkGoogle } = useAuthSettings();

  if (loading) return <p className="settings-loading">Loading…</p>;

  const isEmailProvider = authInfo?.providers?.includes('password');
  const isGoogleLinked  = authInfo?.providers?.includes('google.com');

  return (
    <div className="settings-tab">

      {/* Login method */}
      <div className="settings-card">
        <h4 className="settings-section-title"><Shield size={15} /> Login Method</h4>
        <div className="auth-providers-row">
          <div className={`auth-provider-badge ${isEmailProvider ? 'auth-provider-badge--active' : ''}`}>
            <Mail size={14} /> Email / Password
          </div>
          <div className={`auth-provider-badge ${isGoogleLinked ? 'auth-provider-badge--active' : ''}`}>
            <Globe size={14} /> Google
          </div>
        </div>
      </div>

      {/* Password change */}
      {isEmailProvider && (
        <div className="settings-card">
          <PasswordChangeForm onSubmit={changePassword} />
        </div>
      )}

      {/* OTP */}
      <div className="settings-card">
        <h4 className="settings-section-title"><Shield size={15} /> Two-Factor Security</h4>
        <p className="settings-meta">Require a one-time password every time you log in.</p>
        <label className="pref-toggle-row">
          <span className="pref-toggle-label">Enable OTP on login</span>
          <div
            className={`toggle ${authInfo?.otpEnabled ? 'toggle--on' : ''}`}
            onClick={() => toggleOtp(!authInfo?.otpEnabled)}
            role="switch"
            aria-checked={!!authInfo?.otpEnabled}
          >
            <div className="toggle-thumb" />
          </div>
        </label>
      </div>

      {/* Google link */}
      <div className="settings-card">
        <h4 className="settings-section-title"><Globe size={15} /> Google Account</h4>
        <p className="settings-meta">
          {isGoogleLinked
            ? 'Your Google account is linked. You can sign in with Google.'
            : 'Link your Google account to enable Google sign-in.'}
        </p>
        <button
          className={`settings-btn ${isGoogleLinked ? 'settings-btn--danger' : 'settings-btn--primary'}`}
          onClick={isGoogleLinked ? unlinkGoogle : linkGoogle}
        >
          {isGoogleLinked ? <Unlink size={14} /> : <Link size={14} />}
          {isGoogleLinked ? 'Unlink Google Account' : 'Link Google Account'}
        </button>
      </div>

    </div>
  );
}
