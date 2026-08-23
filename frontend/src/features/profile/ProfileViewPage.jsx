import { useNavigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';
import ProfileCard from './components/ProfileCard';
import './profile.css';

export default function ProfileViewPage({ settingsMode = false }) {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  const editPath = settingsMode ? '/dashboard/settings/profile/edit' : '/dashboard/profile/edit';

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  const displayProfile = profile || {};

  return (
    <div className="profile-page">
      <ProfileCard profile={displayProfile} onEdit={() => navigate(editPath)} />
    </div>
  );
}
