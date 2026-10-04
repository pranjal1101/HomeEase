import React, { memo } from 'react';
import './BookingCard.css';

const BookingCard = memo(({ booking, onEdit, onDelete }) => {
  const { _id, serviceId, bookingDate, bookingTime, address, status } = booking;

  const serviceName = serviceId?.serviceName || 'Unknown Service';
  const category = serviceId?.category || 'General';
  const price = serviceId?.price || 0;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article className="booking-card">
      <div className="booking-card-top">
        <div>
          <span className="booking-category-pill">{category}</span>
          <h3 className="booking-service-title">{serviceName}</h3>
        </div>
        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="booking-card-details">
        <div className="detail-item">
          <span className="detail-label">Date & Time</span>
          <span className="detail-val">{formatDate(bookingDate)} • {bookingTime}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Service Location</span>
          <span className="detail-val">{address}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Hourly Rate</span>
          <span className="detail-val">₹{price} / hour</span>
        </div>
      </div>

      <div className="booking-card-actions">
        {status === 'Pending' ? (
          <>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => onEdit(booking)}
            >
              Reschedule
            </button>
            <button 
              className="btn btn-cta btn-sm" 
              onClick={() => onDelete(_id)}
            >
              Cancel Booking
            </button>
          </>
        ) : (
          <span className="no-actions-text">Status: {status}</span>
        )}
      </div>
    </article>
  );
});

export default BookingCard;
