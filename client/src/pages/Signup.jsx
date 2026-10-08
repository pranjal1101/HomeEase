import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HomeEase | Sign Up';
    if (isAuthenticated && user) {
      if (user.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/bookings', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields including a valid phone number.');
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
      const res = await register({ name, email, phone, password, role: selectedRole });
      if (res.success) {
        if (selectedRole === 'provider') {
          navigate('/provider/dashboard', { replace: true });
        } else {
          navigate('/bookings', { replace: true });
        }
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
            <h1 className="auth-banner-title">Join thousands of happy users & service experts.</h1>
            <p className="auth-banner-desc">
              Create an account in seconds to schedule verified plumbers, electricians, cleaners, or register as a service professional.
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

          <div className="role-selector-container">
            <label className="role-selector-label">Create account as</label>
            <div className="role-selector-toggle">
              <button
                type="button"
                className={`role-option-btn ${selectedRole === 'customer' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRole('customer');
                  setError('');
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                User / Customer
              </button>

              <button
                type="button"
                className={`role-option-btn ${selectedRole === 'provider' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRole('provider');
                  setError('');
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                Service Provider
              </button>
            </div>
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
              <label htmlFor="signup-phone">Contact Number *</label>
              <input 
                type="tel" 
                id="signup-phone"
                className="form-control"
                placeholder="+91 98765 43210"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              {submitting ? 'Creating Account...' : `Sign Up as ${selectedRole === 'provider' ? 'Service Provider' : 'Customer'}`}
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
