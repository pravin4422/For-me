import { ExternalLink } from 'lucide-react';

export default function ExportHistoryTable({ history }) {
  if (!history.length) return <p className="settings-empty">No exports yet.</p>;

  return (
    <table className="settings-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Data Types</th>
          <th>Sheet</th>
        </tr>
      </thead>
      <tbody>
        {history.map((row) => (
          <tr key={row.id}>
            <td>{new Date(row.createdAt).toLocaleDateString()}</td>
            <td>{row.types.join(', ')}</td>
            <td>
              <a href={row.sheetUrl} target="_blank" rel="noreferrer" className="settings-link">
                Open <ExternalLink size={12} />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
