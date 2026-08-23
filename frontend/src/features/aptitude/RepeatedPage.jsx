import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './aptitude.css';

const TOPICS = ['All', 'Percentage', 'Time & Work', 'Ratio', 'Profit & Loss', 'Speed & Distance', 'Algebra', 'Geometry', 'Probability'];

const REPEATED = [
  { id: 1, topic: 'Percentage', title: 'Population increase/decrease over years', freq: 'High', desc: 'Given initial population and % change per year, find population after n years.' },
  { id: 2, topic: 'Percentage', title: 'Price change and consumption adjustment', freq: 'High', desc: 'Price increases by x%, by how much % should consumption decrease to keep expenditure same?' },
  { id: 3, topic: 'Time & Work', title: 'Pipes filling/emptying a tank', freq: 'High', desc: 'Two or three pipes with fill/drain rates — find time to fill or empty.' },
  { id: 4, topic: 'Time & Work', title: 'Work done in alternate days', freq: 'Medium', desc: 'A and B work on alternate days — find total days to complete work.' },
  { id: 5, topic: 'Ratio', title: 'Mixture and alligation', freq: 'High', desc: 'Two mixtures combined in a ratio — find resultant concentration.' },
  { id: 6, topic: 'Profit & Loss', title: 'Dishonest shopkeeper using false weights', freq: 'High', desc: 'Shopkeeper uses x g instead of 1000 g — find actual profit %.' },
  { id: 7, topic: 'Speed & Distance', title: 'Two trains crossing each other', freq: 'High', desc: 'Trains of given lengths moving in same/opposite direction — find crossing time.' },
  { id: 8, topic: 'Algebra', title: 'Age problems with ratios', freq: 'Medium', desc: 'Present age ratio given, find ages after/before n years.' },
  { id: 9, topic: 'Geometry', title: 'Area of shaded region', freq: 'Medium', desc: 'Circle inscribed in square or vice versa — find shaded area.' },
  { id: 10, topic: 'Probability', title: 'Drawing balls from a bag', freq: 'High', desc: 'Bag with coloured balls — probability of drawing specific combination.' },
];

const FREQ_CLASS = { High: 'freq-badge--high', Medium: 'freq-badge--medium', Low: 'freq-badge--low' };

export default function RepeatedPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const navigate = useNavigate();

  const filtered = REPEATED.filter(r =>
    (topic === 'All' || r.topic === topic) &&
    (r.title.toLowerCase().includes(query.toLowerCase()) || r.topic.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="apt-page">
      <div className="apt-header">
        <div className="apt-header__left">
          <div className="apt-header__icon"><RefreshCw size={18} /></div>
          <h1 className="apt-header__title">Repeated Question Types</h1>
        </div>
        <div className="apt-search">
          <Search size={14} />
          <input placeholder="Search question types…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="apt-chips">
        {TOPICS.map(t => (
          <button key={t} className={`apt-chip ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}>{t}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="apt-empty"><Search size={40} /><p>No question types found.</p></div>
      ) : (
        <div className="apt-grid">
          {filtered.map(r => (
            <div key={r.id} className="apt-card">
              <div className="apt-card__top">
                <p className="apt-card__title">{r.title}</p>
                <span className={`freq-badge ${FREQ_CLASS[r.freq]}`}>{r.freq}</span>
              </div>
              <span className="apt-card__topic-badge" style={{ alignSelf: 'flex-start' }}>{r.topic}</span>
              <p className="apt-card__body">{r.desc}</p>
              <div className="apt-card__actions">
                <button className="apt-link-btn" onClick={() => navigate('/dashboard/aptitude/practice')}>
                  Practice Questions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
