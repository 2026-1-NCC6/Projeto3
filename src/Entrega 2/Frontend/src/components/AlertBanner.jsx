import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const icons = {
  warning: AlertCircle,
  danger: AlertCircle,
  success: CheckCircle,
  info: Info
};

export default function AlertBanner({ type, title, message }) {
  const Icon = icons[type] || Info;
  
  return (
    <div className={`alert-banner ${type}`}>
      <div className="alert-icon">
        <Icon size={20} />
      </div>
      <div>
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-text">{message}</div>
      </div>
    </div>
  );
}
