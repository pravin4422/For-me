import { useState } from 'react';
import { FileText, Trash2, X } from 'lucide-react';

function isPdf(doc)  { return doc.type === 'application/pdf' || doc.name?.endsWith('.pdf'); }
function isText(doc) { return doc.type?.startsWith('text/') || doc.name?.endsWith('.txt'); }

function InlineViewer({ doc, onClose }) {
  return (
    <div className="file-viewer__modal" onClick={onClose}>
      <div className="file-viewer__modal-inner" onClick={e => e.stopPropagation()}>
        <div className="file-viewer__modal-header">
          <span>{doc.name}</span>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        {isPdf(doc) && (
          <iframe
            src={doc.url}
            title={doc.name}
            className="file-viewer__iframe"
          />
        )}
        {isText(doc) && (
          <TextContent url={doc.url} />
        )}
        {!isPdf(doc) && !isText(doc) && (
          <div className="file-viewer__unsupported">
            Preview not available. <a href={doc.url} download={doc.name}>Download</a>
          </div>
        )}
      </div>
    </div>
  );
}

function TextContent({ url }) {
  const [text, setText] = useState(null);
  if (!text) {
    fetch(url).then(r => r.text()).then(setText);
    return <div className="tab-loading">Loading...</div>;
  }
  return <pre className="file-viewer__text">{text}</pre>;
}

export default function FileViewer({ documents = [], onDelete }) {
  const [viewing, setViewing] = useState(null);

  if (!documents.length) return null;

  return (
    <div className="file-viewer">
      <h4 className="file-viewer__title">Uploaded Files</h4>
      <ul className="file-viewer__list">
        {documents.map(doc => (
          <li key={doc.id} className="file-viewer__item">
            <button className="file-viewer__name" onClick={() => setViewing(doc)}>
              <FileText size={14} />
              <span>{doc.name}</span>
            </button>
            <button className="icon-btn icon-btn--danger" onClick={() => onDelete(doc.id)}>
              <Trash2 size={13} />
            </button>
          </li>
        ))}
      </ul>
      {viewing && <InlineViewer doc={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
