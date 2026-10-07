import React, { useState, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith('/provider/')) {
    return null;
  }

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      setShowDropdown(false);
      navigate('/login');
    }
  };

  const isProviderRole = user?.role === 'provider';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-left-group">
          <Link to={isProviderRole ? "/provider/dashboard" : "/"} className="navbar-brand">
            <div className="logo-icon-box">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="logo-text">Home<span className="logo-highlight">Ease</span></span>
          </Link>

          <nav className="navbar-links">
            {isProviderRole ? (
              <>
                <Link to="/provider/dashboard" className={`nav-link-item ${isActive('/provider/dashboard')}`}>
                  Dashboard
                </Link>
                <Link to="/provider/services" className={`nav-link-item ${isActive('/provider/services')}`}>
                  My Services
                </Link>
                <Link to="/provider/bookings" className={`nav-link-item ${isActive('/provider/bookings')}`}>
                  Bookings
                </Link>
                <Link to="/provider/earnings" className={`nav-link-item ${isActive('/provider/earnings')}`}>
                  Earnings
                </Link>
                <Link to="/provider/profile" className={`nav-link-item ${isActive('/provider/profile')}`}>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className={`nav-link-item ${isActive('/')}`}>
                  Home
                </Link>
                <Link to="/services" className={`nav-link-item ${isActive('/services')}`}>
                  Services
                </Link>
                <Link to="/bookings" className={`nav-link-item ${isActive('/bookings')}`}>
                  Bookings
                </Link>
                <Link to="/providers" className={`nav-link-item ${isActive('/providers')}`}>
                  Providers
                </Link>
                <Link to="/contact" className={`nav-link-item ${isActive('/contact')}`}>
                  About Us
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="navbar-right-section">
          {isAuthenticated && user ? (
            <>
              <NotificationBell />

              <div className="profile-dropdown-wrapper">
                <button className="profile-trigger-btn" onClick={() => setShowDropdown(!showDropdown)}>
                  <div className="avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="avatar-name">{user.name || 'Account'}</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`chevron-icon ${showDropdown ? 'rotate' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {showDropdown && (
                  <div className="profile-dropdown-menu">
                    {isProviderRole ? (
                      <>
                        <Link to="/provider/dashboard" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                          Provider Dashboard
                        </Link>
                        <Link to="/provider/services" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                          My Services
                        </Link>
                        <Link to="/provider/bookings" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                          Bookings
                        </Link>
                        <Link to="/provider/earnings" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                          Earnings
                        </Link>
                        <Link to="/provider/profile" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                          Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/profile" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                          My Profile
                        </Link>
                        <Link to="/bookings" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                          My Bookings
                        </Link>
                      </>
                    )}
                    <button className="dropdown-menu-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '13.5px' }}>
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '7px 14px', fontSize: '13.5px' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);
