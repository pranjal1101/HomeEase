import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceAPI, userAPI, bookingAPI } from '../services/api';
import Loader from '../components/Loader';
import './BookService.css';

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    document.title = 'HomeEase | Schedule Appointment';

    const initializeBooking = async () => {
      try {
        setLoading(true);
        setError('');

        const serviceResponse = await serviceAPI.getById(serviceId);
        if (!serviceResponse.success) {
          throw new Error('Service not found.');
        }
        setService(serviceResponse.data);

        let user = null;
        const storedUserJson = localStorage.getItem('homeease_user');
        
        if (storedUserJson) {
          try {
            const parsed = JSON.parse(storedUserJson);
            const verifyUser = await userAPI.getById(parsed._id);
            if (verifyUser.success) {
              user = verifyUser.data;
            }
          } catch (err) {
            console.warn('Orphaned cached user profiles.', err);
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
          setAddress(user.address || '');
        } else {
          setError('No active profile detected. Please set up a profile before booking.');
        }

      } catch (err) {
        console.error('Error initializing booking:', err);
        setError(err.message || 'Initialization failed.');
      } finally {
        setLoading(false);
      }
    };

    initializeBooking();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !address) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        userId: activeUser._id,
        serviceId: service._id,
        bookingDate,
        bookingTime,
        address,
        notes
      };

      const response = await bookingAPI.create(payload);
      if (response.success) {
        alert('Booking reserved successfully!');
        navigate('/bookings');
      } else {
        alert(response.message || 'Failed to request booking.');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert(err.response?.data?.message || 'Error occurred while scheduling your booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container section-padding">
        <Loader message="Fetching service metadata..." />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--status-cancelled-text)', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
          {error || 'Service not found.'}
        </p>
        {!activeUser && (
          <Link to="/profile" className="btn btn-primary" style={{ margin: '0 6px' }}>
            Setup Profile
          </Link>
        )}
        <Link to="/services" className="btn btn-secondary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container booking-layout-wrapper">
      <div className="booking-breadcrumb">
        <Link to={`/services/${serviceId}`} className="breadcrumb-back-link">
          Cancel and go back
        </Link>
      </div>

      <div className="booking-grid-layout">
        {/* Left Column: Service Details & Trust Badges */}
        <aside className="booking-details-sidebar-card">
          <div className="booking-sidebar-header">
            <span className="booking-sidebar-cat">{service.category}</span>
            <h3>{service.serviceName}</h3>
          </div>
          
          <div className="booking-sidebar-price-row">
            <span>Rate</span>
            <div className="booking-sidebar-rate">
              ₹{service.price}<span> / hour</span>
            </div>
          </div>

          <div className="booking-trust-list">
            <div className="booking-trust-item">
              <span>Verified Professionals Only</span>
            </div>
            <div className="booking-trust-item">
              <span>No Upfront Reservation Fees</span>
            </div>
            <div className="booking-trust-item">
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>

          <div className="booking-sidebar-helper-card">
            <h5>Payment Information</h5>
            <p>You only pay the standard rate after work is completed and verified by you.</p>
          </div>
        </aside>

        {/* Right Column: Appointment Scheduler Form */}
        <main className="booking-form-main-card">
          <h2>Schedule Appointment</h2>
          <p className="booking-form-subtitle">Choose date, time, and service location details below.</p>

          <form onSubmit={handleSubmit}>
            <div className="booking-form-fields-grid">
              <div className="form-group">
                <label htmlFor="date">Booking Date *</label>
                <input 
                  type="date" 
                  id="date"
                  className="form-control"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Booking Time *</label>
                <input 
                  type="time" 
                  id="time"
                  className="form-control"
                  required
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>

              <div className="form-group booking-form-span-all">
                <label htmlFor="address">Service Address *</label>
                <input 
                  type="text" 
                  id="address"
                  className="form-control"
                  placeholder="Enter full service address (House/Flat No, Area, Vadodara)"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group booking-form-span-all">
                <label htmlFor="notes">Additional Instructions (Optional)</label>
                <textarea 
                  id="notes"
                  className="form-control"
                  placeholder="Provide any specific repair details or entry instructions..."
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="booking-form-actions-row">
              <button 
                type="submit" 
                className="btn btn-primary booking-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Confirming Reservation...' : 'Confirm Booking Request'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default BookService;
