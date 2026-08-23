import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  {
    key: 'rrb', label: 'RRB',
    exams: [
      { id: 'rrb-ntpc',        name: 'RRB NTPC' },
      { id: 'rrb-group-d',     name: 'RRB Group D' },
      { id: 'rrb-je',          name: 'RRB JE' },
      { id: 'rrb-alp',         name: 'RRB ALP' },
      { id: 'rrb-paramedical', name: 'RRB Paramedical' },
    ],
  },
  {
    key: 'ssc', label: 'SSC',
    exams: [
      { id: 'ssc-cgl',  name: 'SSC CGL' },
      { id: 'ssc-chsl', name: 'SSC CHSL' },
      { id: 'ssc-mts',  name: 'SSC MTS' },
      { id: 'ssc-gd',   name: 'SSC GD' },
    ],
  },
  {
    key: 'tnpsc', label: 'TNPSC',
    exams: [
      { id: 'tnpsc-group-1', name: 'Group 1' },
      { id: 'tnpsc-group-2', name: 'Group 2' },
      { id: 'tnpsc-group-4', name: 'Group 4' },
    ],
  },
  {
    key: 'banking', label: 'Banking',
    exams: [
      { id: 'ibps-po',    name: 'IBPS PO' },
      { id: 'ibps-clerk', name: 'IBPS Clerk' },
      { id: 'sbi-po',     name: 'SBI PO' },
      { id: 'sbi-clerk',  name: 'SBI Clerk' },
    ],
  },
  { key: 'other', label: 'Other Exams', exams: [] },
];

function CategoryItem({ cat }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="exams-sidebar__cat">
      <div
        className="exams-sidebar__cat-header"
        onClick={() => { navigate(`/dashboard/exams/${cat.key}`); setOpen(o => !o); }}
      >
        <FileText size={15} />
        <span>{cat.label}</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </div>
      {open && cat.exams.length > 0 && (
        <div className="exams-sidebar__exams">
          {cat.exams.map(e => (
            <NavLink
              key={e.id}
              to={`/dashboard/exams/${cat.key}/${e.id}`}
              className={({ isActive }) => `exams-sidebar__exam-link${isActive ? ' active' : ''}`}
            >
              {e.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExamsSidebar() {
  return (
    <div className="exams-sidebar">
      {CATEGORIES.map(cat => (
        <CategoryItem key={cat.key} cat={cat} />
      ))}
    </div>
  );
}
