import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading services...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--secondary)', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default Loader;
