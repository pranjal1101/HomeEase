import React, { useState, useEffect } from 'react';
import { userAPI, bookingAPI } from '../services/api';
import Loader from '../components/Loader';
import './Profile.css';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingBookings, setFetchingBookings] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form Fields for Create / Update
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  // Fetch all users on mount
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      if (response.success) {
        setUsers(response.data);
        
        // Resolve active user from localStorage cache
        const storedUserJson = localStorage.getItem('homeease_user');
        let selectedUser = null;

        if (storedUserJson) {
          try {
            const parsed = JSON.parse(storedUserJson);
            selectedUser = response.data.find(u => u._id === parsed._id) || null;
          } catch (e) {
            console.warn('Invalid user format stored.');
          }
        }

        // Fallback to first user
        if (!selectedUser && response.data.length > 0) {
          selectedUser = response.data[0];
          localStorage.setItem('homeease_user', JSON.stringify(selectedUser));
        }

        if (selectedUser) {
          setActiveUser(selectedUser);
          populateForm(selectedUser);
          setIsCreating(false);
        } else {
          setActiveUser(null);
          setIsCreating(true); // Default to register screen if no profiles exist
        }
      }
    } catch (err) {
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings for the active user
  const fetchActiveUserBookings = async (userId) => {
    if (!userId) return;
    try {
      setFetchingBookings(true);
      const response = await bookingAPI.getAll({ userId });
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      console.error('Error fetching bookings for profile:', err);
    } finally {
      setFetchingBookings(false);
    }
  };

  useEffect(() => {
    document.title = 'HomeEase | Profile Settings';
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeUser && !isCreating) {
      fetchActiveUserBookings(activeUser._id);
    } else {
      setBookings([]);
    }
  }, [activeUser, isCreating]);

  const populateForm = (user) => {
    setName(user.name || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
    setPassword(''); // Never prefill password
  };

  const handleUserSwitch = (user) => {
    setActiveUser(user);
    localStorage.setItem('homeease_user', JSON.stringify(user));
    populateForm(user);
    setIsCreating(false);
  };

  const handleRegisterProfile = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !address) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name, email, password, phone, address };
      const response = await userAPI.create(payload);
      
      if (response.success) {
        alert('Profile registered successfully!');
        
        const freshUsers = await userAPI.getAll();
        if (freshUsers.success) {
          setUsers(freshUsers.data);
          const newUser = freshUsers.data.find(u => u.email === email);
          if (newUser) {
            setActiveUser(newUser);
            localStorage.setItem('homeease_user', JSON.stringify(newUser));
            populateForm(newUser);
          }
        }
        setIsCreating(false);
      } else {
        alert(response.message || 'Failed to register profile.');
      }
    } catch (err) {
      console.error('Error registering user:', err);
      alert(err.response?.data?.message || 'Error occurred during profile creation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name, email, phone, address };
      if (password) {
        payload.password = password;
      }

      const response = await userAPI.update(activeUser._id, payload);
      if (response.success) {
        alert('Profile updated successfully!');
        const updated = response.data;
        setActiveUser(updated);
        localStorage.setItem('homeease_user', JSON.stringify(updated));
        setUsers(users.map(u => u._id === updated._id ? updated : u));
        setPassword('');
      } else {
        alert(response.message || 'Failed to update.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.response?.data?.message || 'Failed to save updates.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!activeUser) return;
    if (!window.confirm(`Are you sure you want to delete profile "${activeUser.name}"? This will erase all their bookings as well.`)) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await userAPI.delete(activeUser._id);
      if (response.success) {
        alert('Profile deleted successfully.');
        localStorage.removeItem('homeease_user');
        
        const freshUsers = await userAPI.getAll();
        if (freshUsers.success) {
          setUsers(freshUsers.data);
          if (freshUsers.data.length > 0) {
            const nextUser = freshUsers.data[0];
            setActiveUser(nextUser);
            localStorage.setItem('homeease_user', JSON.stringify(nextUser));
            populateForm(nextUser);
            setIsCreating(false);
          } else {
            setActiveUser(null);
            setIsCreating(true);
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
          }
        }
      }
    } catch (err) {
      console.error('Error deleting profile:', err);
      alert('Failed to delete profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container section-padding">
        <Loader message="Loading profile settings..." />
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="section-header">
        <h2>Profile Management</h2>
        <p>Manage accounts, toggle credentials profiles, and view service booking history.</p>
      </div>

      <div className="profile-dashboard-layout">
        {/* Left Column: Profile Card & Switcher */}
        <aside className="profile-sidebar-panel">
          {/* Active Profile Card */}
          {activeUser && !isCreating && (
            <div className="profile-badge-card">
              <div className="badge-avatar-circle">
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="badge-name">{activeUser.name}</h3>
              <span className="badge-pill">Verified Homeowner</span>

              <div className="badge-details-list">
                <div className="badge-detail-item">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>{activeUser.email}</span>
                </div>
                <div className="badge-detail-item">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>{activeUser.phone}</span>
                </div>
                <div className="badge-detail-item">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{activeUser.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Switch Profiles List Card */}
          <div className="profile-switcher-card">
            <h3>Registered Test Accounts</h3>
            {users.length === 0 ? (
              <p className="empty-switcher-note">No test profiles found.</p>
            ) : (
              <div className="switcher-list">
                {users.map((user) => (
                  <div 
                    key={user._id} 
                    className={`switcher-item ${activeUser && activeUser._id === user._id && !isCreating ? 'active' : ''}`}
                    onClick={() => handleUserSwitch(user)}
                  >
                    <div className="switcher-item-left">
                      <div className="item-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="switcher-info">
                        <span className="switcher-name">{user.name}</span>
                        <span className="switcher-email">{user.email}</span>
                      </div>
                    </div>
                    {activeUser && activeUser._id === user._id && !isCreating && (
                      <span className="active-dot">🟢</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button 
              className="btn btn-secondary switcher-new-btn" 
              onClick={() => {
                setIsCreating(true);
                setName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setPassword('');
              }}
            >
              + Create New Profile
            </button>
          </div>
        </aside>

        {/* Right Column: Profile Form Details & Booking History */}
        <main className="profile-main-panel">
          {/* Edit / Create Form Card */}
          <div className="profile-form-card">
            {isCreating ? (
              <div>
                <div className="profile-card-title-row">
                  <h3>Register Profile</h3>
                  <p>Create a test homeowner profile for staging reservations.</p>
                </div>
                <form onSubmit={handleRegisterProfile}>
                  <div className="form-group">
                    <label htmlFor="reg-name">Full Name *</label>
                    <input 
                      type="text" 
                      id="reg-name"
                      className="form-control"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group-split">
                    <div className="form-group">
                      <label htmlFor="reg-email">Email Address *</label>
                      <input 
                        type="email" 
                        id="reg-email"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-password">Password *</label>
                      <input 
                        type="password" 
                        id="reg-password"
                        className="form-control"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-phone">Phone Number *</label>
                    <input 
                      type="text" 
                      id="reg-phone"
                      className="form-control"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-address">Address *</label>
                    <input 
                      type="text" 
                      id="reg-address"
                      className="form-control"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary form-submit-btn" 
                    disabled={submitting}
                  >
                    {submitting ? 'Registering profile...' : 'Register Test Profile'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="profile-card-title-row">
                  <h3>Account Settings</h3>
                  <button 
                    className="btn btn-text delete-account-btn" 
                    onClick={handleDeleteProfile}
                    disabled={submitting}
                  >
                    Delete Profile
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label htmlFor="up-name">Full Name *</label>
                    <input 
                      type="text" 
                      id="up-name"
                      className="form-control"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group-split">
                    <div className="form-group">
                      <label htmlFor="up-email">Email Address *</label>
                      <input 
                        type="email" 
                        id="up-email"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="up-password">New Password (leave blank to keep current)</label>
                      <input 
                        type="password" 
                        id="up-password"
                        className="form-control"
                        placeholder="Enter password to update"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="up-phone">Phone Number *</label>
                    <input 
                      type="text" 
                      id="up-phone"
                      className="form-control"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="up-address">Address *</label>
                    <input 
                      type="text" 
                      id="up-address"
                      className="form-control"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary form-submit-btn" 
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Booking History Table Card */}
          {activeUser && !isCreating && (
            <div className="profile-history-card">
              <h3>Recent Booking History</h3>
              {fetchingBookings ? (
                <p className="loading-history-text">Fetching reservations list...</p>
              ) : bookings.length === 0 ? (
                <p className="empty-history-text">No service bookings registered for this account.</p>
              ) : (
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <strong>{booking.serviceId?.serviceName || 'Unknown Service'}</strong>
                            <span className="table-row-sub">{booking.serviceId?.category}</span>
                          </td>
                          <td>{formatDate(booking.bookingDate)}</td>
                          <td>{booking.bookingTime}</td>
                          <td>
                            <span className={`status-badge ${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
