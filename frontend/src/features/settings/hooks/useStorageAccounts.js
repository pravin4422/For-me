import { useState } from 'react';

const MOCK = [];

export function useStorageAccounts() {
  const [accounts, setAccounts] = useState(MOCK);
  const [loading] = useState(false);

  const addAccount  = async () => {
    const newAcc = {
      id: Date.now().toString(),
      email: 'newdrive@gmail.com',
      provider: 'Google Drive',
      usedBytes: 2.1e9,
      totalBytes: 15e9,
      isPrimary: accounts.length === 0,
      status: 'active',
    };
    setAccounts(p => [...p, newAcc]);
  };

  const removeAccount = async (id) => setAccounts(p => p.filter(a => a.id !== id));

  const setPrimary = async (id) =>
    setAccounts(p => p.map(a => ({ ...a, isPrimary: a.id === id })));

  return { accounts, loading, error: null, addAccount, removeAccount, setPrimary };
}
