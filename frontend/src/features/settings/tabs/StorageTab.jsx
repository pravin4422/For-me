import { useState } from 'react';
import { Plus, HardDrive } from 'lucide-react';
import { useStorageAccounts } from '../hooks/useStorageAccounts';
import LinkedDriveAccountCard from '../components/LinkedDriveAccountCard';
import AddDriveAccountModal from '../components/AddDriveAccountModal';

const MAX_ACCOUNTS = 3;

export default function StorageTab() {
  const { accounts, loading, addAccount, removeAccount, setPrimary } = useStorageAccounts();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <p className="settings-loading">Loading…</p>;

  const usedSlots = accounts.length;

  return (
    <div className="settings-tab">

      {/* Header card */}
      <div className="settings-card storage-header-card">
        <div className="storage-header-left">
          <div className="storage-header-icon"><HardDrive size={22} /></div>
          <div>
            <p className="storage-header-title">Storage Accounts</p>
            <p className="settings-meta">
              {usedSlots} of {MAX_ACCOUNTS} accounts connected. Add more drives when one gets full.
            </p>
          </div>
        </div>
        {usedSlots < MAX_ACCOUNTS && (
          <button className="settings-btn settings-btn--primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Account
          </button>
        )}
      </div>

      {/* Account cards */}
      <div className="storage-cards-list">
        {accounts.length === 0 ? (
          <div className="settings-empty-state">
            <HardDrive size={32} />
            <p>No storage accounts connected yet.</p>
            <button className="settings-btn settings-btn--primary" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Connect Your First Account
            </button>
          </div>
        ) : (
          accounts.map(acc => (
            <LinkedDriveAccountCard
              key={acc.id}
              account={acc}
              onSetPrimary={setPrimary}
              onRemove={removeAccount}
            />
          ))
        )}
      </div>

      {showModal && (
        <AddDriveAccountModal onAdd={addAccount} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
