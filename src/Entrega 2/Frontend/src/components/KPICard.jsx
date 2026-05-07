export default function KPICard({ title, value, unit, icon: Icon, trend }) {
  return (
    <div className="card">
      <div className="card-header" style={{marginBottom: '12px'}}>
        <span className="card-title">
          {Icon && <Icon size={20} style={{color: 'var(--primary)'}} />}
          {title}
        </span>
        {trend && (
          <span className={`badge ${trend > 0 ? 'badge-danger' : 'badge-success'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="kpi-value">
        {value} <span className="kpi-label">{unit}</span>
      </div>
    </div>
  );
}
