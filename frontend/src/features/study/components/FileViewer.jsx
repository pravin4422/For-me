import { useState } from 'react';
import { X } from 'lucide-react';

export default function FileViewer({ doc, onClose }) {
  const [textContent, setTextContent] = useState(null);

  const isPdf  = doc.type === 'application/pdf';
  const isText = doc.type === 'text/plain' || doc.name?.endsWith('.txt');

  if (isText && textContent === null) {
    fetch(doc.url)
      .then(r => r.text())
      .then(setTextContent)
      .catch(() => setTextContent('Unable to load file.'));
  }

  return (
    <div className="file-viewer-overlay" onClick={onClose}>
      <div className="file-viewer" onClick={e => e.stopPropagation()}>
        <div className="file-viewer__header">
          <span className="file-viewer__name">{doc.name}</span>
          <button className="file-viewer__close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="file-viewer__body">
          {isPdf && (
            <iframe
              src={doc.url}
              title={doc.name}
              className="file-viewer__iframe"
            />
          )}
          {isText && (
            <pre className="file-viewer__text">
              {textContent ?? 'Loading…'}
            </pre>
          )}
          {!isPdf && !isText && (
            <div className="file-viewer__unsupported">
              Preview not available.{' '}
              <a href={doc.url} download={doc.name}>Download file</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
