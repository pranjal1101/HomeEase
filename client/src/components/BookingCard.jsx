import React from 'react';
import './BookingCard.css';

const BookingCard = ({ booking, onEdit, onDelete }) => {
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

  const svgColor = 'var(--secondary)';

  return (
    <article className="booking-card">
      <div className="booking-card-header">
        <div className="booking-card-title">
          <h3>{serviceName}</h3>
          <span className="booking-card-category">{category}</span>
        </div>
        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="booking-card-body">
        <p>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={svgColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span><strong>Date:</strong> {formatDate(bookingDate)}</span>
        </p>
        <p>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={svgColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span><strong>Time:</strong> {bookingTime}</span>
        </p>
        <p>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={svgColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span><strong>Location:</strong> {address}</span>
        </p>
        <p>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={svgColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span><strong>Price:</strong> ${price}/hr</span>
        </p>
      </div>

      <div className="booking-card-actions">
        {status === 'Pending' && (
          <>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '13px' }}
              onClick={() => onEdit(booking)}
            >
              Reschedule
            </button>
            <button 
              className="btn btn-cta" 
              style={{ padding: '8px 16px', fontSize: '13px' }}
              onClick={() => onDelete(_id)}
            >
              Cancel Booking
            </button>
          </>
        )}
        {status !== 'Pending' && (
          <span style={{ fontSize: '13px', color: 'var(--soft-accent)', fontStyle: 'italic' }}>
            No actions available
          </span>
        )}
      </div>
    </article>
  );
};

export default BookingCard;
