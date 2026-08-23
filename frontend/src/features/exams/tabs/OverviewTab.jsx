import { Info } from 'lucide-react';

export default function OverviewTab({ data, loading }) {
  if (loading) return <div className="tab-loading">Loading overview...</div>;
  if (!data)   return <div className="tab-empty">No overview data.</div>;

  return (
    <div className="tab-section">
      <div className="tab-section__header"><Info size={16} /><h3>Overview</h3></div>
      <div className="tab-section__body">
        <p><strong>Exam:</strong> {data.name}</p>
        {data.overview?.description && <p>{data.overview.description}</p>}
        {data.overview?.eligibility  && <p><strong>Eligibility:</strong> {data.overview.eligibility}</p>}
        {data.overview?.vacancies    && <p><strong>Vacancies:</strong> {data.overview.vacancies}</p>}
        {data.overview?.notification && <p><strong>Notification:</strong> {data.overview.notification}</p>}
      </div>
    </div>
  );
}
