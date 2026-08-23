import { useRef, useState } from 'react';
import { Camera, User, Trash2, Loader } from 'lucide-react';

export default function ProfilePictureUploader({ pictureUrl, onUpload, onRemove, uploading, progress }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    onUpload(file).then(() => setPreview(null));
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onRemove();
  };

  const src = preview || pictureUrl;

  return (
    <div className="pp-uploader">
      <div className="pp-avatar" onClick={() => !uploading && inputRef.current.click()}>
        {src
          ? <img src={src} alt="Profile" className="pp-img" />
          : <div className="pp-placeholder"><User size={40} /></div>
        }
        {uploading
          ? <div className="pp-overlay"><Loader size={18} className="pp-spin" /><span>{progress}%</span></div>
          : <div className="pp-overlay"><Camera size={18} /></div>
        }
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
      <div className="pp-actions">
        <button type="button" className="pp-btn-change" onClick={() => inputRef.current.click()} disabled={uploading}>
          <Camera size={14} /> Change Photo
        </button>
        {src && (
          <button type="button" className="pp-btn-remove" onClick={handleRemove} disabled={uploading}>
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>
    </div>
  );
}
