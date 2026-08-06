import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, userAPI } from '../services/api';
import BookingCard from '../components/BookingCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reschedule Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleAddress, setRescheduleAddress] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = 'HomeEase | My Bookings';

    const resolveUserAndBookings = async () => {
      try {
        setLoading(true);
        setError('');

        // Resolve active profile cached in localStorage
        let user = null;
        const storedUserJson = localStorage.getItem('homeease_user');
        
        if (storedUserJson) {
          try {
            const parsed = JSON.parse(storedUserJson);
            const verifyUser = await userAPI.getById(parsed._id);
            if (verifyUser.success) {
              user = verifyUser.data;
            }
          } catch (e) {
            console.warn('Invalid user cached. Fetching fresh profiles.');
          }
        }

        if (!user) {
          const usersListResponse = await userAPI.getAll();
          if (usersListResponse.success && usersListResponse.data.length > 0) {
            user = usersListResponse.data[0];
            localStorage.setItem('homeease_user', JSON.stringify(user));
          }
        }

        if (user) {
          setActiveUser(user);
          // Fetch User Bookings from backend Express API
          const response = await bookingAPI.getAll({ userId: user._id });
          if (response.success) {
            setBookings(response.data);
          } else {
            setError(response.message || 'Failed to load bookings.');
          }
        } else {
          setError('No user profile found. Please register an account profile first.');
        }

      } catch (err) {
        console.error('Error loading bookings dashboard:', err);
        setError('Connection failed. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    resolveUserAndBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this service booking?')) {
      return;
    }

    try {
      const response = await bookingAPI.delete(id);
      if (response.success) {
        alert('Booking cancelled successfully.');
        setBookings(bookings.filter(b => b._id !== id));
      } else {
        alert(response.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Error occurred while trying to cancel the booking.');
    }
  };

  const handleOpenReschedule = (booking) => {
    setSelectedBooking(booking);
    
    // Format date string to YYYY-MM-DD for input value matching
    const date = new Date(booking.bookingDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    setRescheduleDate(`${yyyy}-${mm}-${dd}`);
    setRescheduleTime(booking.bookingTime);
    setRescheduleAddress(booking.address);
    setIsModalOpen(true);
  };

  const handleSaveReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime || !rescheduleAddress) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setUpdating(true);
      const payload = {
        bookingDate: rescheduleDate,
        bookingTime: rescheduleTime,
        address: rescheduleAddress
      };

      const response = await bookingAPI.update(selectedBooking._id, payload);
      if (response.success) {
        alert('Booking rescheduled successfully!');
        setBookings(bookings.map(b => b._id === selectedBooking._id ? response.data : b));
        setIsModalOpen(false);
      } else {
        alert(response.message || 'Failed to reschedule.');
      }
    } catch (err) {
      console.error('Error rescheduling booking:', err);
      alert('Failed to save updated reschedule parameters.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container section-padding">
      <div className="bookings-top-bar">
        <div>
          <h2>Your Service Bookings</h2>
          <p>Manage, track, or reschedule your booked home assistance appointments.</p>
        </div>
        <Link to="/services" className="btn btn-primary">
          Book Another Service
        </Link>
      </div>

      {loading ? (
        <div className="bookings-grid">
          <SkeletonLoader count={2} />
        </div>
      ) : error || !activeUser ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--status-cancelled)', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>
            {error || 'No active user found.'}
          </p>
          <Link to="/profile" className="btn btn-primary">
            Setup Active Profile
          </Link>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState 
          icon="📅"
          title="No Bookings Found"
          message="You don't have any active service appointments scheduled. Browse our service catalog to book trusted experts today."
          actionButton={
            <Link to="/services" className="btn btn-cta">
              Find Services
            </Link>
          }
        />
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              onEdit={handleOpenReschedule}
              onDelete={handleCancelBooking}
            />
          ))}
        </div>
      )}

      {/* Reschedule Popup Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reschedule Appointment"
        footerButtons={
          <>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={updating}
            >
              Cancel
            </button>
            <button 
              className="btn btn-cta" 
              onClick={handleSaveReschedule}
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveReschedule}>
          <div className="form-group">
            <label htmlFor="resched-date">New Date *</label>
            <input 
              type="date" 
              id="resched-date"
              className="form-control"
              required
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resched-time">New Time *</label>
            <input 
              type="time" 
              id="resched-time"
              className="form-control"
              required
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resched-address">Service Address *</label>
            <input 
              type="text" 
              id="resched-address"
              className="form-control"
              required
              value={rescheduleAddress}
              onChange={(e) => setRescheduleAddress(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyBookings;
