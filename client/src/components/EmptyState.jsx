import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon = '🔍', title = 'No results found', message = 'Try adjusting your search filters or check back later.', actionButton }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
