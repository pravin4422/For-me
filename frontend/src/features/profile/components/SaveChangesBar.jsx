import { Loader } from 'lucide-react';

export default function SaveChangesBar({ dirty, saving, onSave, onCancel }) {
  if (!dirty) return null;

  return (
    <div className="save-bar">
      <span className="save-bar-hint">You have unsaved changes</span>
      <div className="save-bar-actions">
        <button className="save-bar-cancel" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button className="save-bar-save" onClick={onSave} disabled={saving}>
          {saving ? <><Loader size={14} className="pp-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
