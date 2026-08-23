import { useState } from 'react';

const MOCK_HISTORY = [
  { id: '1', createdAt: '2025-01-10T10:00:00Z', types: ['study_progress', 'budget'], sheetUrl: '#' },
  { id: '2', createdAt: '2025-01-05T08:30:00Z', types: ['mock_test_results'],         sheetUrl: '#' },
];

export function useDataExport() {
  const [history, setHistory]     = useState(MOCK_HISTORY);
  const [exporting, setExporting] = useState(false);
  const [loading] = useState(false);

  const exportToSheet = async (selectedTypes) => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 1200));
    const entry = { id: Date.now().toString(), createdAt: new Date().toISOString(), types: selectedTypes, sheetUrl: '#' };
    setHistory(h => [entry, ...h]);
    setExporting(false);
    return entry;
  };

  return { history, loading, exporting, error: null, exportToSheet };
}
