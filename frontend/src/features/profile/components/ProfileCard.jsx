import { User, Mail, Phone, MapPin, BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import { OCCUPATION_OPTIONS, EDUCATION_OPTIONS } from './ProfileAdditionalDetailsForm';

const label = (options, val) => options.find(o => o.value === val)?.label || val;

function InfoRow({ icon, value }) {
  if (!value) return null;
  return (
    <div className="pc-info-row">
      {icon}
      <span>{value}</span>
    </div>
  );
}

export default function ProfileCard({ profile = {}, onEdit }) {
  const { fullName, email, phone, dob, gender, location, targetExam, education, occupation, bio, pictureUrl } = profile;

  return (
    <div className="profile-card">
      <div className="pc-header">
        <div className="pc-avatar">
          {pictureUrl
            ? <img src={pictureUrl} alt={fullName} />
            : <div className="pc-avatar-placeholder"><User size={44} /></div>
          }
        </div>
        <div className="pc-identity">
          <h2 className="pc-name">{fullName || 'No name set'}</h2>
          {occupation && <span className="pc-badge">{label(OCCUPATION_OPTIONS, occupation)}</span>}
        </div>
        {onEdit && (
          <button className="pc-edit-btn" onClick={onEdit}>
            Edit Profile
          </button>
        )}
      </div>

      {bio && <p className="pc-bio">{bio}</p>}

      <div className="pc-details">
        <InfoRow icon={<Mail size={14} />}        value={email} />
        <InfoRow icon={<Phone size={14} />}       value={phone} />
        <InfoRow icon={<MapPin size={14} />}      value={location} />
        <InfoRow icon={<BookOpen size={14} />}    value={targetExam} />
        <InfoRow icon={<GraduationCap size={14} />} value={label(EDUCATION_OPTIONS, education)} />
        <InfoRow icon={<Briefcase size={14} />}   value={dob} />
      </div>
    </div>
  );
}
