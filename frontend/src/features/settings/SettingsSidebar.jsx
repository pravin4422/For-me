import { NavLink } from 'react-router-dom';
import { User, Shield, HardDrive, SlidersHorizontal, FileSpreadsheet } from 'lucide-react';

const TABS = [
  { label: 'Profile',        path: '/dashboard/settings/profile',        icon: <User size={18} /> },
  { label: 'Authentication', path: '/dashboard/settings/authentication',  icon: <Shield size={18} /> },
  { label: 'Storage',        path: '/dashboard/settings/storage',         icon: <HardDrive size={18} /> },
  { label: 'Preferences',    path: '/dashboard/settings/preferences',     icon: <SlidersHorizontal size={18} /> },
  { label: 'Data Export',    path: '/dashboard/settings/data-export',     icon: <FileSpreadsheet size={18} /> },
];

export default function SettingsSidebar() {
  return (
    <aside className="settings-sidebar">
      <div className="nav-section">
        <span className="nav-section-label">Settings</span>
        {TABS.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item nav-leaf depth-0${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
