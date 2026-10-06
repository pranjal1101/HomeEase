import React, { useState, useEffect } from 'react';
import { providerAPI } from '../../services/api';
import ProviderLayout from '../../components/ProviderLayout';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import './ProviderBookings.css';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const [updatingId, setUpdatingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filterTabs = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await providerAPI.getBookings({
        status: activeFilter,
        search: searchQuery,
        sort: sortOption
      });
      if (res?.success) {
        setBookings(res.data || []);
      } else {
        setError(res?.message || 'Failed to fetch bookings.');
      }
    } catch (err) {
      console.warn('Backend getBookings warning:', err.response?.data?.message || err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeFilter, searchQuery, sortOption]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await providerAPI.updateBookingStatus(bookingId, newStatus);
      if (res?.success) {
        fetchBookings();
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(res?.message || 'Failed to update booking status.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error updating status.');
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#49225B' }}>Bookings</h1>
        <p style={{ color: '#5A5266', fontSize: '14px', marginTop: '2px' }}>
          View and manage customer appointments for your registered services.
        </p>
      </div>

      <div className="bookings-controls-bar">
        <div className="booking-filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bookings-search-sort-group">
          <div className="search-input-wrapper">
            <svg
              className="search-icon-inside"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search customer/service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="highest_price">Sort: Highest Price</option>
          </select>
        </div>
      </div>

      <div className="provider-section-card">
        {loading ? (
          <div style={{ padding: '24px' }}>
            <SkeletonLoader count={5} height="50px" />
          </div>
        ) : error ? (
          <div style={{ color: '#C62828', padding: '24px', textAlign: 'center' }}>
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No bookings found"
            message={
              searchQuery || activeFilter !== 'All'
                ? 'No booking records match your filter criteria.'
                : 'You have not received any booking requests yet.'
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="provider-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Address</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{b.userId?.name || 'Customer'}</div>
                      <div style={{ fontSize: '12px', color: '#7A7285' }}>{b.userId?.phone || b.userId?.email || ''}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{b.serviceId?.serviceName || 'Service'}</div>
                      <div style={{ fontSize: '12px', color: '#7A7285' }}>{b.serviceId?.category || ''}</div>
                    </td>
                    <td>
                      <div>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: '#7A7285' }}>{b.bookingTime || 'N/A'}</div>
                    </td>
                    <td style={{ maxWidth: '180px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.address}>
                        {b.address || 'Location'}
                      </div>
                    </td>
                    <td style={{ fontWeight: '700', color: '#49225B' }}>
                      ₹{b.serviceId?.price || 0}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(b.status)}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedBooking(b)}
                        >
                          View Details
                        </button>

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
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusUpdate(b._id, 'Completed')}
                            disabled={updatingId === b._id}
                          >
                            Mark Completed
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
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title="Booking Details"
        >
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#7A7285', fontWeight: '600', textTransform: 'uppercase' }}>
                  CUSTOMER INFORMATION
                </label>
                <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '4px' }}>
                  {selectedBooking.userId?.name || 'Customer'}
                </div>
                <div style={{ fontSize: '13px', color: '#5A5266' }}>{selectedBooking.userId?.email}</div>
                <div style={{ fontSize: '13px', color: '#5A5266' }}>{selectedBooking.userId?.phone}</div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#7A7285', fontWeight: '600', textTransform: 'uppercase' }}>
                  SERVICE DETAILS
                </label>
                <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '4px' }}>
                  {selectedBooking.serviceId?.serviceName || 'Service'}
                </div>
                <div style={{ fontSize: '13px', color: '#5A5266' }}>Category: {selectedBooking.serviceId?.category}</div>
                <div style={{ fontWeight: '700', color: '#49225B', marginTop: '4px' }}>
                  Price: ₹{selectedBooking.serviceId?.price || 0}
                </div>
              </div>
            </div>

            <div style={{ background: '#FAFAF8', padding: '16px', borderRadius: '8px', border: '1px solid #E2D5E8', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#7A7285' }}>Scheduled Date: </span>
                  <strong style={{ fontSize: '13.5px', display: 'block', marginTop: '2px' }}>
                    {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString() : 'N/A'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#7A7285' }}>Scheduled Time: </span>
                  <strong style={{ fontSize: '13.5px', display: 'block', marginTop: '2px' }}>
                    {selectedBooking.bookingTime || 'N/A'}
                  </strong>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#7A7285' }}>Service Location Address: </span>
                <div style={{ fontSize: '13.5px', fontWeight: '500', marginTop: '2px' }}>
                  {selectedBooking.address || 'Address not provided'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: '#7A7285' }}>Booking Created Date: </span>
                <span style={{ fontSize: '13px', color: '#5A5266' }}>
                  {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <span className={getStatusBadgeClass(selectedBooking.status)}>
                {selectedBooking.status}
              </span>

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

export default ProviderBookings;
