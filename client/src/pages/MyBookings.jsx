import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import './MyBookings.css';

const statusTabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const MyBookings = () => {
  const { user: activeUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleAddress, setRescheduleAddress] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = 'HomeEase | My Bookings';

    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        setError('');

        if (activeUser) {
          const response = await bookingAPI.getAll();
          if (response.success) {
            setBookings(response.data);
          } else {
            setError(response.message || 'Failed to load bookings.');
          }
        } else {
          setError('Please log in to view your bookings.');
        }

      } catch (err) {
        console.error('Error loading bookings:', err);
        setError(err.response?.data?.message || 'Connection failed. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [activeUser]);

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

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedStatus === 'All') return true;
      return b.status.toLowerCase() === selectedStatus.toLowerCase();
    });
  }, [bookings, selectedStatus]);

  return (
    <div className="container section-padding">
      <div className="bookings-top-bar">
        <div>
          <h2>Your Service Bookings</h2>
          <p>Track, manage, or reschedule your service appointments.</p>
        </div>
        <Link to="/services" className="btn btn-primary">
          Book Another Service
        </Link>
      </div>

      <div className="bookings-tabs-bar">
        {statusTabs.map(tab => (
          <button 
            key={tab}
            className={`tab-btn ${selectedStatus === tab ? 'active' : ''}`}
            onClick={() => setSelectedStatus(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid-2">
          <SkeletonLoader count={2} />
        </div>
      ) : error || !activeUser ? (
        <div className="bookings-error-box">
          <p>{error || 'No active user profile found.'}</p>
          <Link to="/profile" className="btn btn-primary">
            Setup Profile
          </Link>
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState 
          icon=""
          title="No Bookings Found"
          message={selectedStatus === 'All' ? "You don't have any service appointments scheduled." : `No ${selectedStatus.toLowerCase()} bookings found.`}
          actionButton={
            <Link to="/services" className="btn btn-secondary">
              Explore Services
            </Link>
          }
        />
      ) : (
        <div className="grid-2">
          {filteredBookings.map((booking) => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              onEdit={handleOpenReschedule}
              onDelete={handleCancelBooking}
            />
          ))}
        </div>
      )}

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
              className="btn btn-primary" 
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
