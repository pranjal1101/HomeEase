import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  React.useEffect(() => {
    document.title = 'HomeEase | 404 Page Not Found';
  }, []);

  return (
    <div className="container section-padding" style={{ 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <span style={{ fontSize: '72px', marginBottom: '24px' }}>🕵️‍♂️</span>
      <h1 style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1.2 }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--secondary)', fontSize: '18px', maxWidth: '480px', margin: '0 auto 36px' }}>
        The link you followed may be broken or the page has been moved. Let's get you back on track.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
