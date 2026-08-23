import { useState } from 'react';
import { PlayCircle, Plus, Trash2, ExternalLink } from 'lucide-react';

export default function YouTubeLinks({ examId }) {
  const [links, setLinks] = useState([]);
  const [url,   setUrl]   = useState('');
  const [title, setTitle] = useState('');

  const add = () => {
    if (!url.trim()) return;
    setLinks(prev => [...prev, { id: Date.now(), url: url.trim(), title: title.trim() || url.trim() }]);
    setUrl(''); setTitle('');
  };

  return (
    <div className="yt-links">
      <div className="yt-links__header"><PlayCircle size={16} /><h4>YouTube Links</h4></div>
      <div className="yt-links__form">
        <input className="exam-input" placeholder="YouTube URL *" value={url} onChange={e => setUrl(e.target.value)} />
        <input className="exam-input" placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
        <button className="btn-primary" onClick={add}><Plus size={14} /> Add</button>
      </div>
      {links.length === 0
        ? <p className="tab-empty">No links added yet.</p>
        : (
          <ul className="yt-links__list">
            {links.map(l => (
              <li key={l.id} className="yt-links__item">
                <a href={l.url} target="_blank" rel="noreferrer" className="yt-links__title">
                  <ExternalLink size={13} /> {l.title}
                </a>
                <button className="icon-btn icon-btn--danger" onClick={() => setLinks(p => p.filter(x => x.id !== l.id))}>
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
