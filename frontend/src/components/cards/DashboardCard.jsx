import { Link } from 'react-router-dom';
import './DashboardCard.css';

export default function DashboardCard({ title, icon, viewAllLink, children, className = '' }) {
  return (
    <div className={`dash-card ${className}`}>
      <div className="dash-card-header">
        <div className="dash-card-title">
          {icon && <span className="dash-card-icon">{icon}</span>}
          <span>{title}</span>
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="dash-card-viewall">View all</Link>
        )}
      </div>
      <div className="dash-card-body">{children}</div>
    </div>
  );
}
