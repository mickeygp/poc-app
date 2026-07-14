import "./MockContent.css";

interface MockContentProps {
  title: string;
  description: string;
  stats?: { label: string; value: string }[];
  rows?: Record<string, string>[];
  columns?: string[];
}

export default function MockContent({
  title,
  description,
  stats = [],
  rows = [],
  columns = [],
}: MockContentProps) {
  return (
    <div className="mock-content">
      <header className="mock-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {stats.length > 0 && (
        <div className="mock-stats">
          {stats.map((s) => (
            <div className="mock-stat-card" key={s.label}>
              <div className="mock-stat-value">{s.value}</div>
              <div className="mock-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {rows.length > 0 && columns.length > 0 && (
        <div className="mock-table-wrap">
          <table className="mock-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c}>{row[c]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length === 0 && (
        <div className="mock-empty">
          This is a mock screen for "{title}". Wire up real data here.
        </div>
      )}
    </div>
  );
}
