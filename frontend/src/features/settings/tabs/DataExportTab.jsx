import { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { useDataExport } from '../hooks/useDataExport';
import ExportSelectionList from '../components/ExportSelectionList';
import ExportHistoryTable from '../components/ExportHistoryTable';

export default function DataExportTab() {
  const { history, loading, exporting, exportToSheet } = useDataExport();
  const [selected, setSelected] = useState([]);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    if (!selected.length) return;
    await exportToSheet(selected);
    setSelected([]);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div className="settings-tab">

      {/* Export selector */}
      <div className="settings-card">
        <h4 className="settings-section-title"><FileSpreadsheet size={15} /> Select Data to Export</h4>
        <p className="settings-meta">
          Selected data will be exported to a new Google Sheet in your connected Drive.
        </p>
        <ExportSelectionList selected={selected} onChange={setSelected} />
        <div className="settings-form-footer">
          {done && <p className="settings-success">Export complete. Check history below.</p>}
          <button
            className="settings-btn settings-btn--primary"
            onClick={handleExport}
            disabled={!selected.length || exporting}
          >
            <Download size={14} />
            {exporting ? 'Exporting…' : `Export ${selected.length > 0 ? `(${selected.length})` : ''} to Google Sheet`}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="settings-card">
        <h4 className="settings-section-title">Export History</h4>
        <p className="settings-meta">All your past exports with links to the generated sheets.</p>
        {loading
          ? <p className="settings-loading">Loading…</p>
          : <ExportHistoryTable history={history} />
        }
      </div>

    </div>
  );
}
