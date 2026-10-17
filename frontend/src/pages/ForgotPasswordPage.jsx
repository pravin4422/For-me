import { useState, useEffect } from 'react';
import './ForgotPasswordPage.css';

const RESEND_COOLDOWN = 30;

export default function ForgotPasswordPage({ onSendResetLink, onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const validate = () => {
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMessage(err); return; }
    setErrorMessage('');
    setLoading(true);
    try {
      await onSendResetLink?.(email);
      setSubmittedEmail(email);
      setSubmitted(true);
      setResendCooldown(RESEND_COOLDOWN);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN);
    try {
      await onSendResetLink?.(submittedEmail);
    } catch {
      // silent fail on resend
    }
  };

  return (
    <div className="forgot-page-wrapper">
    <div className="forgot-page">
      <div className="forgot-card">



        {!submitted ? (
          <>
            <h1 className="forgot-heading">Forgot your password?</h1>
            <p className="forgot-subtext">Enter your registered email and we'll send you a reset link.</p>

            <form className="forgot-form" onSubmit={handleSubmit} noValidate>
              <div className="forgot-field">
                <label className="forgot-label" htmlFor="forgot-email">Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="forgot-email"
                    className={`forgot-input${errorMessage ? ' forgot-input--error' : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrorMessage(''); }}
                    autoComplete="email"
                  />
                  <i className="fa-solid fa-envelope" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.85)', pointerEvents: 'none' }} />
                </div>
                {errorMessage && <span className="forgot-field-error">{errorMessage}</span>}
              </div>

              <button className="forgot-button" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="forgot-back-text">
              <button className="forgot-link-btn" onClick={() => onNavigate?.('login')}>Back to Login</button>
            </p>
          </>
        ) : (
          <div className="forgot-confirm">
            <span className="forgot-confirm-icon">
              <i className="fa-solid fa-circle-check" />
            </span>
            <h1 className="forgot-heading">Check your email</h1>
            <p className="forgot-subtext">
              We've sent a password reset link to<br />
              <strong>{submittedEmail}</strong>
            </p>
            <p className="forgot-resend-text">
              Didn't receive it?{' '}
              {resendCooldown > 0 ? (
                <span className="forgot-resend-cooldown">Resend in {resendCooldown}s</span>
              ) : (
                <button className="forgot-link-btn" onClick={handleResend}>Resend link</button>
              )}
            </p>
            <button className="forgot-button" onClick={() => onNavigate?.('login')}>
              Back to Login
            </button>
          </div>
        )}

      </div>
    </div>
    </div>
  );
}
