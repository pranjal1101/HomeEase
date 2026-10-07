import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProviderProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container section-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader message="Verifying provider authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'provider' && user?.role !== 'admin') {
    return (
      <div className="container section-padding" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '12px', border: '1px solid #BFB5A9', boxShadow: '0 2px 8px rgba(41, 28, 14, 0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E8DFD5', color: '#291C0E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px', fontWeight: 'bold' }}>
            !
          </div>
          <h2 style={{ color: '#291C0E', fontSize: '22px', marginBottom: '12px' }}>Access Restricted</h2>
          <p style={{ color: '#6F473B', marginBottom: '24px', fontSize: '14.5px' }}>
            The Service Provider Dashboard is exclusively available for service provider accounts. You are currently logged in as a <strong>{user?.role || 'customer'}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="/" className="btn btn-secondary">Go to Home</a>
            <a href="/login" className="btn btn-primary">Switch Account</a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProviderProtectedRoute;
