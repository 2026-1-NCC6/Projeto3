import React from 'react';
import './Card.css';

const Card = ({ children, className = '', noPadding = false, glass = true }) => {
  const baseClass = glass ? 'ui-card glass-panel' : 'ui-card solid-panel';
  const paddingClass = noPadding ? 'no-padding' : 'with-padding';
  
  return (
    <div className={`${baseClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
