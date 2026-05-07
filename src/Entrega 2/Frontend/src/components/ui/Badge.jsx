import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'info', className = '' }) => {
  return (
    <span className={`ui-badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
