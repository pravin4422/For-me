import { useState } from 'react';
import { X, HardDrive } from 'lucide-react';

export default function AddDriveAccountModal({ onAdd, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleConnect = async () => {
    setLoading(true); setError('');
    try {
      // providerToken would come from OAuth popup in real implementation
      await onAdd('OAUTH_TOKEN_PLACEHOLDER');
      onClose();
    } catch {
      setError('Failed to connect account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title"><HardDrive size={18} /> Connect Storage Account</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <p className="modal-body">
          Connect an additional storage account to expand your available space.
          You can link up to 3 accounts.
        </p>
        {error && <p className="settings-error">{error}</p>}
        <div className="modal-footer">
          <button className="settings-btn settings-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="settings-btn settings-btn--primary" onClick={handleConnect} disabled={loading}>
            {loading ? 'Connecting…' : 'Connect with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
