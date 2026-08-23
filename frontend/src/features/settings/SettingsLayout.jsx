import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { User, Shield, HardDrive, SlidersHorizontal, FileSpreadsheet } from 'lucide-react';
import ProfileTab        from './tabs/ProfileTab';
import AuthenticationTab from './tabs/AuthenticationTab';
import StorageTab        from './tabs/StorageTab';
import PreferencesTab    from './tabs/PreferencesTab';
import DataExportTab     from './tabs/DataExportTab';
import './settings.css';

const TABS = [
  { path: '/dashboard/settings/profile',        label: 'Profile',        icon: <User size={15} /> },
  { path: '/dashboard/settings/authentication', label: 'Authentication',  icon: <Shield size={15} /> },
  { path: '/dashboard/settings/storage',        label: 'Storage',         icon: <HardDrive size={15} /> },
  { path: '/dashboard/settings/preferences',    label: 'Preferences',     icon: <SlidersHorizontal size={15} /> },
  { path: '/dashboard/settings/data-export',    label: 'Data Export',     icon: <FileSpreadsheet size={15} /> },
];

export default function SettingsLayout() {
  return (
    <div className="settings-layout">
      <nav className="settings-tabs">
        {TABS.map(t => (
          <NavLink
            key={t.path}
            to={t.path}
            end
            className={({ isActive }) => `settings-tab-link${isActive ? ' active' : ''}`}
          >
            {t.icon}
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="settings-content">
        <Routes>
          <Route index                  element={<Navigate to="profile" replace />} />
          <Route path="profile/*"        element={<ProfileTab />} />
          <Route path="authentication"  element={<AuthenticationTab />} />
          <Route path="storage"         element={<StorageTab />} />
          <Route path="preferences"     element={<PreferencesTab />} />
          <Route path="data-export"     element={<DataExportTab />} />
        </Routes>
      </div>
    </div>
  );
}
