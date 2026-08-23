import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLogin, onGoogleLogin, onNavigate }) {
  const [mode, setMode] = useState('email'); // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleModeSwitch = (m) => {
    setMode(m);
    setIdentifier('');
    setErrorMessage('');
  };

  const validate = () => {
    if (mode === 'email') {
      if (!identifier.trim()) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) return 'Enter a valid email address.';
    } else {
      if (!identifier.trim()) return 'Mobile number is required.';
      if (!/^[6-9]\d{9}$/.test(identifier)) return 'Enter a valid 10-digit mobile number.';
    }
    if (!password) return 'Password is required.';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMessage(err); return; }
    setErrorMessage('');
    setLoading(true);
    try {
      await onLogin?.(identifier, password);
    } catch {
      setErrorMessage('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await onGoogleLogin?.();
    } catch {
      setErrorMessage('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page">
        <div className="login-card">

          <div className="login-brand">
          <span className="login-brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          <span className="login-brand-name">ProTrack</span>
        </div>

          <h1 className="login-heading">Login to your account</h1>
          <p className="login-subtext">Welcome back! Please enter your details.</p>

            <div className="login-tab-switch">
              <button
                type="button"
                className={`login-tab${mode === 'email' ? ' login-tab--active' : ''}`}
                onClick={() => handleModeSwitch('email')}
              >Email</button>
              <button
                type="button"
                className={`login-tab${mode === 'phone' ? ' login-tab--active' : ''}`}
                onClick={() => handleModeSwitch('phone')}
              >Mobile</button>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label className="login-label" htmlFor="login-identifier">
                  {mode === 'email' ? 'Email' : 'Mobile Number'}
                </label>
                {mode === 'phone' ? (
                  <div className="login-phone-wrap">
                    <span className="login-phone-prefix">+91</span>
                    <input
                      id="login-identifier"
                      className="login-input login-input--phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={identifier}
                      onChange={e => { if (/^\d{0,10}$/.test(e.target.value)) setIdentifier(e.target.value); setErrorMessage(''); }}
                      maxLength={10}
                      autoComplete="tel"
                    />
                    <i className="fa-solid fa-mobile-screen" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }} />
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-identifier"
                      className="login-input"
                      type="email"
                      placeholder="you@example.com"
                      value={identifier}
                      onChange={e => { setIdentifier(e.target.value); setErrorMessage(''); }}
                      autoComplete="email"
                    />
                    <i className="fa-solid fa-envelope" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.85)', pointerEvents: 'none' }} />
                  </div>
                )}
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="login-password">Password</label>
                <div className="login-password-wrap">
                  <input
                    id="login-password"
                    className="login-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-lock'}`} />
                  </button>
                </div>
                <div className="login-forgot-wrap">
                  <button type="button" className="link-btn" onClick={() => onNavigate?.('forgot-password')}>
                    Forgot password?
                  </button>
                </div>
              </div>

              {errorMessage && <p className="login-error">{errorMessage}</p>}

              <button className="login-button" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="login-divider">
              <span className="login-divider-line" />
              <span className="login-divider-text">or</span>
              <span className="login-divider-line" />
            </div>

            <button className="login-google-btn" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

          <p className="login-signup-text">
            Don't have an account?{' '}
            <button className="link-btn" onClick={() => onNavigate?.('signup')}>Sign Up</button>
          </p>

        </div>
      </div>
    </div>
  );
}
