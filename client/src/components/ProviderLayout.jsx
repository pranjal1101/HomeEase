import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { providerAPI } from '../services/api';
import './ProviderLayout.css';

const ProviderLayout = ({ children }) => {
  const { user, logout, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [toggling, setToggling] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleToggleAvailability = async () => {
    const nextStatus = !isAvailable;
    setIsAvailable(nextStatus);
    setToggling(true);
    try {
      const res = await providerAPI.updateProfile({ isAvailable: nextStatus });
      if (res?.success && res?.user) {
        setUser(res.user);
        localStorage.setItem('homeease_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Failed to update provider status:', err);
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from Provider Portal?')) {
      logout();
      navigate('/login');
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/provider/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      label: 'My Services',
      path: '/provider/services',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      label: 'Bookings',
      path: '/provider/bookings',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      label: 'Earnings',
      path: '/provider/earnings',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      label: 'Profile',
      path: '/provider/profile',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  return (
    <div className="provider-layout">
      <div 
        className={`provider-drawer-overlay ${mobileDrawerOpen ? 'show' : ''}`}
        onClick={() => setMobileDrawerOpen(false)}
      />

      <aside className={`provider-sidebar ${mobileDrawerOpen ? 'open' : ''}`}>
        <div className="provider-sidebar-header">
          <Link to="/provider/dashboard" className="provider-brand" onClick={() => setMobileDrawerOpen(false)}>
            <div className="provider-brand-logo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <div className="provider-brand-title">
                Home<span className="provider-brand-highlight">Ease</span>
              </div>
              <span className="provider-badge-tag">Provider Portal</span>
            </div>
          </Link>
        </div>

        <nav className="provider-nav-list">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`provider-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileDrawerOpen(false)}
            >
              <span className="provider-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="provider-sidebar-footer">
          <div className="provider-user-box">
            <div className="provider-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="provider-user-info">
              <div className="provider-user-name" title={user?.name}>{user?.name || 'Service Provider'}</div>
              <div className="provider-user-role">Service Provider</div>
            </div>
          </div>

          <div className="provider-status-toggle">
            <span className="provider-status-label">
              <span className={`status-dot ${isAvailable ? 'on' : 'off'}`}></span>
              {isAvailable ? 'Available' : 'Offline'}
            </span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={isAvailable} 
                onChange={handleToggleAvailability}
                disabled={toggling}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <button className="provider-logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="provider-main-wrapper">
        <header className="provider-topbar">
          <button 
            className="btn btn-text" 
            style={{ padding: '6px' }}
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div style={{ fontWeight: '700', color: '#49225B', fontSize: '17px' }}>
            Home<span style={{ color: '#6E3482' }}>Ease</span> Provider
          </div>
          <div style={{ width: '32px' }}></div>
        </header>

        <main className="provider-content-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
