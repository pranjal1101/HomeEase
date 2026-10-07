import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { providerAPI } from '../../services/api';
import ProviderLayout from '../../components/ProviderLayout';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await providerAPI.getDashboard();
      if (res?.success) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to load dashboard data.');
      }
    } catch (err) {
      console.warn('Backend dashboard API warning:', err.response?.data?.message || err.message);
      setData({
        provider: {
          name: user?.name || 'Service Provider'
        },
        stats: {
          totalBookings: 0,
          pendingRequests: 0,
          completedJobs: 0,
          totalEarnings: 0
        },
        recentBookings: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await providerAPI.updateBookingStatus(bookingId, newStatus);
      if (res?.success) {
        fetchDashboardData();
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(res?.message || 'Failed to update status.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-badge pending';
      case 'Accepted':
      case 'Confirmed':
        return 'status-badge confirmed';
      case 'Completed':
        return 'status-badge completed';
      case 'Rejected':
      case 'Cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  return (
    <ProviderLayout>
      <div className="dashboard-header-banner">
        <h1 className="dashboard-header-title">
          Welcome back, {user?.name || data?.provider?.name || 'Provider'}
        </h1>
        <p className="dashboard-header-subtitle">
          Manage your services, bookings and earnings from one place.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <SkeletonLoader height="100px" />
          <SkeletonLoader height="100px" />
          <SkeletonLoader height="100px" />
          <SkeletonLoader height="100px" />
        </div>
      ) : (
        <div className="stat-cards-grid">
          <div className="stat-card">
            <div>
              <div className="stat-card-label">Total Bookings</div>
              <div className="stat-card-value">{data?.stats?.totalBookings ?? 0}</div>
            </div>
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-card-label">Pending Requests</div>
              <div className="stat-card-value" style={{ color: '#6F473B' }}>
                {data?.stats?.pendingRequests ?? 0}
              </div>
            </div>
            <div className="stat-card-icon" style={{ backgroundColor: '#E8DFD5', color: '#6F473B' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-card-label">Completed Jobs</div>
              <div className="stat-card-value" style={{ color: '#6F473B' }}>
                {data?.stats?.completedJobs ?? 0}
              </div>
            </div>
            <div className="stat-card-icon" style={{ backgroundColor: '#BFB5A9', color: '#291C0E' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-card-label">Total Earnings</div>
              <div className="stat-card-value" style={{ color: '#291C0E' }}>
                ₹{(data?.stats?.totalEarnings ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="stat-card-icon" style={{ backgroundColor: '#E8DFD5', color: '#291C0E' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="provider-section-card">
        <div className="provider-section-header">
          <h2 className="provider-section-title">Recent Booking Requests</h2>
          <Link to="/provider/bookings" className="btn btn-secondary btn-sm">
            View All Bookings
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '24px' }}>
            <SkeletonLoader count={4} height="48px" />
          </div>
        ) : error ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#291C0E' }}>
            {error}
          </div>
        ) : !data?.recentBookings || data.recentBookings.length === 0 ? (
          <EmptyState
            title="No booking requests yet"
            message="When customers book your services, their booking requests will appear right here."
            actionText="Manage My Services"
            actionLink="/provider/services"
          />
        ) : (
          <div className="table-responsive">
            <table className="provider-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{b.userId?.name || 'Customer'}</div>
                      <div style={{ fontSize: '12px', color: '#A78D78' }}>{b.userId?.phone || b.userId?.email || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{b.serviceId?.serviceName || 'Service'}</div>
                      <div style={{ fontSize: '12px', color: '#A78D78' }}>{b.serviceId?.category || ''}</div>
                    </td>
                    <td>
                      <div>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: '#A78D78' }}>{b.bookingTime || 'N/A'}</div>
                    </td>
                    <td style={{ maxWidth: '180px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.address}>
                        {b.address || 'Service Location'}
                      </div>
                    </td>
                    <td style={{ fontWeight: '700', color: '#291C0E' }}>
                      ₹{b.serviceId?.price || 0}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(b.status)}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        {b.status === 'Pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleStatusUpdate(b._id, 'Accepted')}
                              disabled={updatingId === b._id}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleStatusUpdate(b._id, 'Rejected')}
                              disabled={updatingId === b._id}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {(b.status === 'Accepted' || b.status === 'Confirmed') && (
                          <>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setSelectedBooking(b)}
                            >
                              View Details
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(b._id, 'Completed')}
                              disabled={updatingId === b._id}
                            >
                              Mark Completed
                            </button>
                          </>
                        )}

                        {b.status === 'Completed' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedBooking(b)}
                          >
                            Details
                          </button>
                        )}

                        {(b.status === 'Rejected' || b.status === 'Cancelled') && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedBooking(b)}
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBooking && (
        <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title="Booking Details">
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#A78D78', fontWeight: '600' }}>CUSTOMER</label>
                <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '2px' }}>
                  {selectedBooking.userId?.name || 'Customer'}
                </div>
                <div style={{ fontSize: '13px', color: '#6F473B' }}>{selectedBooking.userId?.email}</div>
                <div style={{ fontSize: '13px', color: '#6F473B' }}>{selectedBooking.userId?.phone}</div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#A78D78', fontWeight: '600' }}>SERVICE</label>
                <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '2px' }}>
                  {selectedBooking.serviceId?.serviceName || 'Service'}
                </div>
                <div style={{ fontSize: '13px', color: '#6F473B' }}>Category: {selectedBooking.serviceId?.category}</div>
                <div style={{ fontWeight: '700', color: '#291C0E', marginTop: '4px' }}>
                  Price: ₹{selectedBooking.serviceId?.price || 0}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px', background: '#E8DFD5', padding: '14px', borderRadius: '8px', border: '1px solid #BFB5A9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#7A7285' }}>Booking Date: </span>
                  <strong style={{ fontSize: '13.5px' }}>{selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString() : 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#7A7285' }}>Time: </span>
                  <strong style={{ fontSize: '13.5px' }}>{selectedBooking.bookingTime || 'N/A'}</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#7A7285' }}>Address: </span>
                <div style={{ fontSize: '13.5px', marginTop: '2px', fontWeight: '500' }}>
                  {selectedBooking.address || 'Address not specified'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <div>
                <span className={getStatusBadgeClass(selectedBooking.status)}>
                  {selectedBooking.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedBooking.status === 'Pending' && (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusUpdate(selectedBooking._id, 'Accepted')}
                      disabled={updatingId === selectedBooking._id}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleStatusUpdate(selectedBooking._id, 'Rejected')}
                      disabled={updatingId === selectedBooking._id}
                    >
                      Reject
                    </button>
                  </>
                )}

                {(selectedBooking.status === 'Accepted' || selectedBooking.status === 'Confirmed') && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStatusUpdate(selectedBooking._id, 'Completed')}
                    disabled={updatingId === selectedBooking._id}
                  >
                    Mark Completed
                  </button>
                )}

                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBooking(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </ProviderLayout>
  );
};

export default ProviderDashboard;
