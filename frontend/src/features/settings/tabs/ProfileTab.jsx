import { useNavigate } from 'react-router-dom';
import ProfileViewPage from '../../profile/ProfileViewPage';
import ProfileEditPage from '../../profile/ProfileEditPage';
import { Routes, Route } from 'react-router-dom';

export default function ProfileTab() {
  return (
    <Routes>
      <Route index element={<ProfileViewPage settingsMode />} />
      <Route path="edit" element={<ProfileEditPage settingsMode />} />
    </Routes>
  );
}
