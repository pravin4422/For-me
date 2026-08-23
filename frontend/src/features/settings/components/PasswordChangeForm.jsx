import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function PasswordChangeForm({ onSubmit }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(false);
    if (form.next !== form.confirm) { setError('Passwords do not match.'); return; }
    try {
      await onSubmit(form.current, form.next);
      setSuccess(true);
      setForm({ current: '', next: '', confirm: '' });
    } catch {
      setError('Failed to change password. Check your current password.');
    }
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h4 className="settings-section-title"><Lock size={15} /> Change Password</h4>
      {['current', 'next', 'confirm'].map((k) => (
        <input
          key={k}
          type="password"
          className="settings-input"
          placeholder={k === 'current' ? 'Current password' : k === 'next' ? 'New password' : 'Confirm new password'}
          value={form[k]}
          onChange={set(k)}
          required
        />
      ))}
      {error   && <p className="settings-error">{error}</p>}
      {success && <p className="settings-success">Password updated successfully.</p>}
      <button type="submit" className="settings-btn settings-btn--primary">Update Password</button>
    </form>
  );
}
