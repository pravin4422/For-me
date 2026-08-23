function formatBytes(bytes) {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
}

export default function StorageUsageBar({ usedBytes, totalBytes }) {
  const pct = totalBytes > 0 ? Math.min((usedBytes / totalBytes) * 100, 100) : 0;
  const color = pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#5f59f7';

  return (
    <div className="storage-bar-wrap">
      <div className="storage-bar-track">
        <div className="storage-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="storage-bar-label">
        {formatBytes(usedBytes)} / {formatBytes(totalBytes)} used
      </span>
    </div>
  );
}
