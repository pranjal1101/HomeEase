import React, { useState, useEffect, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [activeUser, setActiveUser] = useState({ name: 'Pranjal' });
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load user profile details if logged in
  useEffect(() => {
    let lastUserStr = '';

    const checkUser = () => {
      const storedUserStr = localStorage.getItem('homeease_user');
      if (storedUserStr) {
        if (storedUserStr !== lastUserStr) {
          try {
            const parsed = JSON.parse(storedUserStr);
            setActiveUser(parsed);
            lastUserStr = storedUserStr;
          } catch (err) {
            console.warn('Failed parsing user info.', err);
          }
        }
      } else if (lastUserStr !== 'default') {
        setActiveUser({ name: 'Pranjal' });
        lastUserStr = 'default';
      }
    };
    checkUser();
    
    window.addEventListener('storage', checkUser);
    const interval = setInterval(checkUser, 2000);

    return () => {
      window.removeEventListener('storage', checkUser);
      clearInterval(interval);
    };
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('homeease_user');
      setActiveUser({ name: 'Pranjal' });
      navigate('/profile');
      setShowDropdown(false);
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="header-left-group">
          <Link to="/" className="navbar-brand">
            <div className="logo-icon-box">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="logo-text">Home<span className="logo-highlight">Ease</span></span>
          </Link>

          <nav className="navbar-links">
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
          </nav>
        </div>

        {/* Right: Notifications & Profile Actions */}
        <div className="navbar-right-section">
          <div className="bell-container" title="Notifications" onClick={() => alert('No new notifications.')}>
            <button className="bell-button" aria-label="Notifications">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="bell-badge-dot"></span>
            </button>
          </div>

          <div className="profile-dropdown-wrapper">
            <button className="profile-trigger-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="avatar-circle">
                {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <span className="avatar-name">{activeUser.name || 'Pranjal'}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`chevron-icon ${showDropdown ? 'rotate' : ''}`}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showDropdown && (
              <div className="profile-dropdown-menu">
                <Link to="/profile" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                  My Profile
                </Link>
                <Link to="/bookings" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                  My Bookings
                </Link>
                <button className="dropdown-menu-item logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);
