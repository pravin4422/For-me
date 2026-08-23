// Data-driven options — add new entries here without changing component logic
export const OCCUPATION_OPTIONS = [
  { value: 'student',    label: 'Student' },
  { value: 'working',    label: 'Working Professional' },
  { value: 'preparing',  label: 'Exam Preparation' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'other',      label: 'Other' },
];

export const EDUCATION_OPTIONS = [
  { value: '10th',        label: '10th / SSLC' },
  { value: '12th',        label: '12th / HSC' },
  { value: 'diploma',     label: 'Diploma' },
  { value: 'ug',          label: "Bachelor's Degree (UG)" },
  { value: 'pg',          label: "Master's Degree (PG)" },
  { value: 'phd',         label: 'PhD / Doctorate' },
  { value: 'other',       label: 'Other' },
];

export default function ProfileAdditionalDetailsForm({ values, onChange }) {
  const field = (name) => ({
    value: values[name] || '',
    onChange: (e) => onChange(name, e.target.value),
  });

  return (
    <div className="profile-form-section">
      <h3 className="profile-form-title">Additional Details</h3>
      <div className="profile-form-grid">
        <div className="pf-field">
          <label>Current Study Focus / Target Exam</label>
          <input className="pf-input" {...field('targetExam')} placeholder="e.g. UPSC, SSC CGL, TNPSC" />
        </div>

        <div className="pf-field">
          <label>Education Qualification</label>
          <select className="pf-input" {...field('education')}>
            <option value="">Select qualification</option>
            {EDUCATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="pf-field">
          <label>Occupation / Current Status</label>
          <select className="pf-input" {...field('occupation')}>
            <option value="">Select status</option>
            {OCCUPATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="pf-field pf-field--full">
          <label>Bio / About</label>
          <textarea className="pf-input pf-textarea" {...field('bio')} placeholder="A short bio about yourself..." rows={3} maxLength={300} />
          <span className="pf-char-count">{(values.bio || '').length}/300</span>
        </div>
      </div>
    </div>
  );
}
