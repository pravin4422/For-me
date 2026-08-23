const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function ProfileBasicInfoForm({ values, onChange, errors }) {
  const field = (name) => ({
    value: values[name] || '',
    onChange: (e) => onChange(name, e.target.value),
  });

  return (
    <div className="profile-form-section">
      <h3 className="profile-form-title">Basic Information</h3>
      <div className="profile-form-grid">
        <div className="pf-field">
          <label>Full Name <span className="pf-required">*</span></label>
          <input className={`pf-input ${errors.fullName ? 'pf-input--error' : ''}`} {...field('fullName')} placeholder="Your full name" />
          {errors.fullName && <span className="pf-error">{errors.fullName}</span>}
        </div>

        <div className="pf-field">
          <label>Email</label>
          <input className="pf-input pf-input--readonly" value={values.email || ''} readOnly />
        </div>

        <div className="pf-field">
          <label>Phone Number <span className="pf-required">*</span></label>
          <input className={`pf-input ${errors.phone ? 'pf-input--error' : ''}`} {...field('phone')} placeholder="+91 XXXXX XXXXX" />
          {errors.phone && <span className="pf-error">{errors.phone}</span>}
        </div>

        <div className="pf-field">
          <label>Date of Birth</label>
          <input className="pf-input" type="date" {...field('dob')} />
        </div>

        <div className="pf-field">
          <label>Gender <span className="pf-optional">(optional)</span></label>
          <select className="pf-input" {...field('gender')}>
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="pf-field">
          <label>Location / City</label>
          <input className="pf-input" {...field('location')} placeholder="City, State" />
        </div>
      </div>
    </div>
  );
}
