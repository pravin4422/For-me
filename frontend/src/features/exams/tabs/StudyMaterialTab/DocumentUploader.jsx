import { useRef, useState } from 'react';
import { Upload, Loader } from 'lucide-react';

const ACCEPTED = '.pdf,.doc,.docx,.txt';

export default function DocumentUploader({ onUpload, loading }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await onUpload(file);
    }
    setUploading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="doc-uploader">
      <div
        className="doc-uploader__zone"
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading || loading
          ? <Loader size={20} className="spin" />
          : <Upload size={20} />
        }
        <span>Drop files here or click to upload</span>
        <small>PDF, DOC, DOCX, TXT</small>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}
