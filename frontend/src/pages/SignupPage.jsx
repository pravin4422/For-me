import { useState, useRef } from 'react';
import './SignupPage.css';

function EmailVerifyStep({ email, onContinue, onResend }) {
  return (
    <div className="signup-verify-step">
      <span className="signup-verify-icon">
        <i className="fa-solid fa-envelope-circle-check" style={{ fontSize: 36 }} />
      </span>
      <h2 className="signup-heading">Verify your email</h2>
      <p className="signup-subtext">
        We sent a verification link to<br />
        <strong>{email}</strong>
      </p>
      <p className="signup-verify-hint">Check your inbox and click the link to activate your account.</p>
      <button className="signup-button" onClick={onContinue}>Continue</button>
      <p className="signup-redirect-text">
        Didn't get it?{' '}
        <button className="signup-link-btn" onClick={onResend}>Resend verification email</button>
      </p>
    </div>
  );
}

function OTPStep({ onVerify, onResend, loading }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="signup-otp-step">
      <p className="signup-otp-label">Enter the 6-digit code sent to your email</p>
      <div className="signup-otp-boxes">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => (inputs.current[i] = el)}
            className="signup-otp-input"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
          />
        ))}
      </div>
      <button
        className="signup-button"
        onClick={() => onVerify(otp.join(''))}
        disabled={loading || otp.join('').length < 6}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      <p className="signup-redirect-text">
        Didn't receive it?{' '}
        <button className="signup-link-btn" onClick={onResend}>Resend OTP</button>
      </p>
    </div>
  );
}

export default function SignupPage({ onSignup, onGoogleSignup, onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form'); // 'form' | 'email-verify' | 'otp'

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await onSignup?.(fullName, email, password);
      setStep('email-verify');
    } catch {
      setErrors({ form: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrors({});
    setLoading(true);
    try {
      await onGoogleSignup?.();
    } catch {
      setErrors({ form: 'Google sign-up failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div className="signup-page">
      <div className="signup-card">

        <div className="signup-brand">
          <span className="signup-brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          <span className="signup-brand-name">ProTrack</span>
        </div>

        {step === 'form' && (
          <>
            <h1 className="signup-heading">Create your account</h1>
            <p className="signup-subtext">Get started with your all-in-one dashboard.</p>

            <form className="signup-form" onSubmit={handleSubmit} noValidate>

              <div className="signup-field">
                <label className="signup-label" htmlFor="signup-fullname">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-fullname"
                    className={`signup-input${errors.fullName ? ' signup-input--error' : ''}`}
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    autoComplete="name"
                  />
                  <i className="fa-solid fa-user" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.85)', pointerEvents: 'none' }} />
                </div>
                {errors.fullName && <span className="signup-field-error">{errors.fullName}</span>}
              </div>

              <div className="signup-field">
                <label className="signup-label" htmlFor="signup-email">Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-email"
                    className={`signup-input${errors.email ? ' signup-input--error' : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <i className="fa-solid fa-envelope" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.85)', pointerEvents: 'none' }} />
                </div>
                {errors.email && <span className="signup-field-error">{errors.email}</span>}
              </div>

              <div className="signup-field">
                <label className="signup-label" htmlFor="signup-password">Password</label>
                <div className="signup-password-wrap">
                  <input
                    id="signup-password"
                    className={`signup-input${errors.password ? ' signup-input--error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-lock'}`} />
                  </button>
                </div>
                {errors.password
                  ? <span className="signup-field-error">{errors.password}</span>
                  : <span className="signup-hint">At least 8 characters</span>
                }
              </div>

              <div className="signup-field">
                <label className="signup-label" htmlFor="signup-confirm">Confirm Password</label>
                <div className="signup-password-wrap">
                  <input
                    id="signup-confirm"
                    className={`signup-input${errors.confirmPassword ? ' signup-input--error' : ''}`}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-lock'}`} />
                  </button>
                </div>
                {errors.confirmPassword && <span className="signup-field-error">{errors.confirmPassword}</span>}
              </div>

              {errors.form && <p className="signup-error">{errors.form}</p>}

              <button className="signup-button" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="signup-divider">
              <span className="signup-divider-line" />
              <span className="signup-divider-text">or</span>
              <span className="signup-divider-line" />
            </div>

            <button className="signup-google-btn" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <p className="signup-redirect-text">
              Already have an account?{' '}
              <button className="signup-link-btn" onClick={() => onNavigate?.('login')}>Login</button>
            </p>
          </>
        )}

        {step === 'email-verify' && (
          <EmailVerifyStep
            email={email}
            onContinue={() => onNavigate?.('dashboard')}
            onResend={() => console.log('Resend verification email')}
          />
        )}

        {step === 'otp' && (
          <OTPStep
            loading={loading}
            onVerify={code => console.log('OTP:', code)}
            onResend={() => console.log('Resend OTP')}
          />
        )}

        {/* Dev toggles — remove in production */}
        {step === 'form' && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
            <button className="signup-link-btn" style={{ fontSize: '12px', opacity: 0.4 }} onClick={() => setStep('email-verify')}>
              Show email verify (dev)
            </button>
            <button className="signup-link-btn" style={{ fontSize: '12px', opacity: 0.4 }} onClick={() => setStep('otp')}>
              Show OTP (dev)
            </button>
          </div>
        )}
        {step !== 'form' && (
          <button className="signup-link-btn" style={{ fontSize: '12px', opacity: 0.4, marginTop: '12px', textAlign: 'center' }} onClick={() => setStep('form')}>
            Back to form (dev)
          </button>
        )}

      </div>
      </div>
    </div>
  );
}
