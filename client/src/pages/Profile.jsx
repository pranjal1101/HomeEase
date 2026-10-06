import React, { useState, useEffect } from 'react';
import { userAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import './Profile.css';

const Profile = () => {
  const { user: activeUser, setUser, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingBookings, setFetchingBookings] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'HomeEase | Account Profile';
    if (activeUser) {
      setName(activeUser.name || '');
      setEmail(activeUser.email || '');
      setPhone(activeUser.phone || '');
      setAddress(activeUser.address || '');
      setPassword('');
      fetchUserBookings();
    }
  }, [activeUser]);

  const fetchUserBookings = async () => {
    try {
      setFetchingBookings(true);
      const response = await bookingAPI.getAll();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      console.error('Error fetching bookings for profile:', err);
    } finally {
      setFetchingBookings(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
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
        setUser(updated);
        localStorage.setItem('homeease_user', JSON.stringify(updated));
        setPassword('');
      } else {
        alert(response.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.response?.data?.message || 'Failed to save profile updates.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!activeUser) return;
    if (!window.confirm(`Are you sure you want to delete profile "${activeUser.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await userAPI.delete(activeUser._id);
      if (response.success) {
        alert('Profile deleted successfully.');
        logout();
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

  if (loading || !activeUser) {
    return (
      <div className="container section-padding">
        <Loader message="Loading profile settings..." />
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="section-header">
        <h2>Account & Profile Management</h2>
        <p>Update personal information and view your recent booking history.</p>
      </div>

      <div className="profile-dashboard-layout">
        <aside className="profile-sidebar-panel">
          <div className="profile-badge-card">
            <div className="badge-avatar-circle">
              {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="badge-name">{activeUser.name}</h3>
            <span className="badge-pill">{activeUser.role ? activeUser.role.toUpperCase() : 'CUSTOMER'} ACCOUNT</span>

            <div className="badge-details-list">
              <div className="badge-detail-item">
                <span className="item-label">Email:</span> {activeUser.email}
              </div>
              <div className="badge-detail-item">
                <span className="item-label">Phone:</span> {activeUser.phone || 'Not set'}
              </div>
              <div className="badge-detail-item">
                <span className="item-label">Address:</span> {activeUser.address || 'Not set'}
              </div>
            </div>
          </div>
        </aside>

        <main className="profile-main-panel">
          <div className="profile-form-card">
            <div>
              <div className="profile-card-title-row">
                <h3>Account Settings</h3>
                <button 
                  className="btn btn-text delete-account-btn" 
                  onClick={handleDeleteProfile}
                  disabled={submitting}
                >
                  Delete Account
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
                    <label htmlFor="up-password">New Password (optional)</label>
                    <input 
                      type="password" 
                      id="up-password"
                      className="form-control"
                      placeholder="Leave blank to keep current"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="up-phone">Phone Number</label>
                  <input 
                    type="text" 
                    id="up-phone"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="up-address">Service Address</label>
                  <input 
                    type="text" 
                    id="up-address"
                    className="form-control"
                    placeholder="Enter service address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary form-submit-btn" 
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>

          <div className="profile-history-card">
            <h3>Recent Booking History</h3>
            {fetchingBookings ? (
              <p className="loading-history-text">Loading reservations...</p>
            ) : bookings.length === 0 ? (
              <p className="empty-history-text">No service bookings found for this account.</p>
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
        </main>
      </div>
    </div>
  );
};

export default Profile;
