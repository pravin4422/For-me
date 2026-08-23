import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';
import { useProfilePicture } from './hooks/useProfilePicture';
import ProfilePictureUploader from './components/ProfilePictureUploader';
import ProfileBasicInfoForm from './components/ProfileBasicInfoForm';
import ProfileAdditionalDetailsForm from './components/ProfileAdditionalDetailsForm';
import SaveChangesBar from './components/SaveChangesBar';
import './profile.css';

function validate(values) {
  const errors = {};
  if (!values.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!values.phone?.trim()) errors.phone = 'Phone number is required';
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(values.phone.trim())) errors.phone = 'Enter a valid phone number';
  return errors;
}

export default function ProfileEditPage({ settingsMode = false, onComplete }) {
  const navigate = useNavigate();
  const { profile, loading, saving, updateProfile, setProfile } = useProfile();
  const { uploading, progress, uploadPicture, removePicture } = useProfilePicture(setProfile);

  const [values, setValues] = useState({});
  const [dirty,  setDirty]  = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) setValues(profile);
  }, [profile]);

  const handleChange = (name, value) => {
    setValues(p => ({ ...p, [name]: value }));
    setDirty(true);
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSave = async () => {
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await updateProfile(values);
    setDirty(false);
    if (onComplete) { onComplete(); return; }
    navigate(settingsMode ? '/dashboard/settings/profile' : '/dashboard');
  };

  const handleCancel = () => {
    if (profile) setValues(profile);
    setDirty(false);
    setErrors({});
    if (!settingsMode) navigate('/dashboard');
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-page profile-edit-page">
      <div className="profile-edit-body">
        <ProfilePictureUploader
          pictureUrl={profile?.pictureUrl}
          onUpload={uploadPicture}
          onRemove={removePicture}
          uploading={uploading}
          progress={progress}
        />
        <ProfileBasicInfoForm values={values} onChange={handleChange} errors={errors} />
        <ProfileAdditionalDetailsForm values={values} onChange={handleChange} />
      </div>
      <SaveChangesBar dirty={dirty} saving={saving} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
