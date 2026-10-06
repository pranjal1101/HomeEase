import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HomeEase | Sign Up';
    if (isAuthenticated) {
      navigate('/bookings', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const res = await register({ name, email, password });
      if (res.success) {
        navigate('/bookings', { replace: true });
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to register account.');
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
            <h1 className="auth-banner-title">Join thousands of happy homeowners.</h1>
            <p className="auth-banner-desc">
              Create an account in seconds to schedule verified plumbers, electricians, cleaners, and repair technicians.
            </p>
          </div>

          <div className="auth-banner-img-box">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
              alt="Home Technician Specialist"
            />
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Get started with HomeEase today</p>
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
              <label htmlFor="signup-name">Full Name *</label>
              <input 
                type="text" 
                id="signup-name"
                className="form-control"
                placeholder="e.g. John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address *</label>
              <input 
                type="email" 
                id="signup-email"
                className="form-control"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password *</label>
              <input 
                type="password" 
                id="signup-password"
                className="form-control"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password *</label>
              <input 
                type="password" 
                id="signup-confirm-password"
                className="form-control"
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
