import { Trophy } from 'lucide-react';
import './aptitude.css';

const LEADERBOARD = [
  { rank: 1, name: 'Arjun K.', score: 980, accuracy: '94%', tests: 12 },
  { rank: 2, name: 'Priya S.', score: 945, accuracy: '91%', tests: 10 },
  { rank: 3, name: 'Rahul M.', score: 910, accuracy: '88%', tests: 14 },
  { rank: 4, name: 'Sneha R.', score: 875, accuracy: '85%', tests: 9 },
  { rank: 5, name: 'You',      score: 820, accuracy: '80%', tests: 8 },
];

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankPage() {
  return (
    <div className="apt-page">
      <div className="apt-header">
        <div className="apt-header__left">
          <div className="apt-header__icon"><Trophy size={18} /></div>
          <h1 className="apt-header__title">Rank</h1>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table className="apt-rank-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>Accuracy</th>
              <th>Tests Taken</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map(r => (
              <tr key={r.rank} style={r.name === 'You' ? { background: 'var(--accent-bg)' } : {}}>
                <td><span className="apt-rank-medal">{MEDALS[r.rank] || r.rank}</span></td>
                <td style={r.name === 'You' ? { fontWeight: 700, color: 'var(--accent)' } : {}}>{r.name}</td>
                <td style={{ fontWeight: 600 }}>{r.score}</td>
                <td>{r.accuracy}</td>
                <td>{r.tests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
