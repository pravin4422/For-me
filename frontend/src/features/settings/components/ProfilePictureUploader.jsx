import { useRef } from 'react';
import { Camera, User } from 'lucide-react';

export default function ProfilePictureUploader({ avatarUrl, onUpload }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="avatar-uploader" onClick={() => inputRef.current.click()}>
      {avatarUrl
        ? <img src={avatarUrl} alt="avatar" className="avatar-img" />
        : <div className="avatar-placeholder"><User size={36} /></div>
      }
      <div className="avatar-overlay"><Camera size={18} /></div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
    </div>
  );
}
