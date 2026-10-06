import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/bookings';

  useEffect(() => {
    document.title = 'HomeEase | Log In';
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-split-wrapper">
        <div className="auth-split-banner">
          <div>
            <div className="auth-banner-brand">
              <div className="logo-icon-box">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="logo-text">Home<span className="logo-highlight">Ease</span></span>
            </div>
            <h1 className="auth-banner-title">Welcome back to effortless home care.</h1>
            <p className="auth-banner-desc">
              Log in to manage appointments, connect with verified experts, and track your active bookings in real-time.
            </p>
          </div>

          <div className="auth-banner-img-box">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
              alt="Home Cleaning Professional"
            />
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Log In</h2>
            <p>Access your HomeEase customer account</p>
          </div>

          {error && (
            <div className="auth-error-alert">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address *</label>
              <input 
                type="email" 
                id="login-email"
                className="form-control"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password *</label>
              <input 
                type="password" 
                id="login-password"
                className="form-control"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="auth-footer-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
