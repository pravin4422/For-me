import { useRef } from 'react';
import { Upload } from 'lucide-react';

const ACCEPTED = '.pdf,.doc,.docx,.txt';

export default function DocumentUploader({ onUpload }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    Array.from(e.target.files).forEach(onUpload);
    e.target.value = '';
  };

  return (
    <div className="doc-uploader">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button className="doc-uploader__btn" onClick={() => inputRef.current.click()}>
        <Upload size={14} /> Upload File
      </button>
      <span className="doc-uploader__hint">PDF, DOC, TXT</span>
    </div>
  );
}
