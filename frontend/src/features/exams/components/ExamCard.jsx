import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function ExamCard({ exam, category }) {
  const navigate = useNavigate();

  return (
    <div
      className="exam-card"
      onClick={() => navigate(`/dashboard/exams/${category}/${exam.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="exam-card__icon"><FileText size={20} /></div>
      <div className="exam-card__body">
        <h4 className="exam-card__name">{exam.name}</h4>
        {exam.description && <p className="exam-card__desc">{exam.description}</p>}
      </div>
    </div>
  );
}
