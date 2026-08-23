import { HardDrive, Star, Trash2 } from 'lucide-react';
import StorageUsageBar from './StorageUsageBar';

export default function LinkedDriveAccountCard({ account, onSetPrimary, onRemove }) {
  const { id, email, provider, usedBytes, totalBytes, isPrimary, status } = account;

  return (
    <div className={`storage-card ${isPrimary ? 'storage-card--primary' : ''}`}>
      <div className="storage-card-header">
        <HardDrive size={18} />
        <div className="storage-card-info">
          <span className="storage-card-email">{email}</span>
          <span className="storage-card-provider">{provider}</span>
        </div>
        <span className={`storage-card-status storage-card-status--${status}`}>{status}</span>
        {isPrimary && <span className="storage-card-badge"><Star size={12} /> Primary</span>}
      </div>
      <StorageUsageBar usedBytes={usedBytes} totalBytes={totalBytes} />
      <div className="storage-card-actions">
        {!isPrimary && (
          <button className="settings-btn settings-btn--ghost" onClick={() => onSetPrimary(id)}>
            <Star size={14} /> Set as Primary
          </button>
        )}
        <button className="settings-btn settings-btn--danger" onClick={() => onRemove(id)}>
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
