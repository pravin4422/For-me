import { TrendingDown } from 'lucide-react';
import CutoffChart from '../components/CutoffChart';

export default function CutoffTab({ data, loading }) {
  if (loading) return <div className="tab-loading">Loading cutoffs...</div>;
  const cutoffs = data?.cutoffs ?? [];

  return (
    <div className="tab-section">
      <div className="tab-section__header"><TrendingDown size={16} /><h3>Cutoff Marks</h3></div>
      <CutoffChart cutoffs={cutoffs} />
    </div>
  );
}
