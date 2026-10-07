import React, { useState, memo } from 'react';
import { paymentAPI } from '../services/api';
import './BookingCard.css';

const BookingCard = memo(({ booking, onEdit, onDelete, onPaymentSuccess }) => {
  const { _id, serviceId, bookingDate, bookingTime, address, status: initialStatus, paymentStatus: initialPaymentStatus } = booking;

  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus || (initialStatus === 'Completed' ? 'Paid' : 'Pending'));
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

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

  const handlePayNow = async () => {
    try {
      setIsPaying(true);
      setPaymentError('');
      const response = await paymentAPI.simulatePayment(_id);
      if (response.success) {
        setStatus('Completed');
        setPaymentStatus('Paid');
        if (onPaymentSuccess) {
          onPaymentSuccess(response.data?.booking || { ...booking, status: 'Completed', paymentStatus: 'Paid' });
        }
      } else {
        setPaymentError(response.message || 'Payment simulation failed.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.response?.data?.message || 'Failed to complete simulated payment.');
    } finally {
      setIsPaying(false);
    }
  };

  const isPaymentPending = status === 'Payment Pending';
  const isCompletedAndPaid = status === 'Completed' || paymentStatus === 'Paid';

  const providerName = serviceId?.providerId?.name || serviceId?.providerName || 'HomeEase Verified Specialist';
  const providerPhone = serviceId?.providerId?.phone || serviceId?.providerPhone || '';

  return (
    <article className="booking-card">
      <div className="booking-card-top">
        <div>
          <span className="booking-category-pill">{category}</span>
          <h3 className="booking-service-title">{serviceName}</h3>
        </div>
        <span className={`status-badge ${status.toLowerCase().replace(/\s+/g, '-')}`}>
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
          <span className="detail-label">Total Amount</span>
          <span className="detail-val">₹{price}</span>
        </div>

        <div className="detail-item" style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px dashed #BFB5A9' }}>
          <span className="detail-label" style={{ color: '#6F473B' }}>Assigned Service Provider</span>
          <span className="detail-val" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontWeight: '700', color: '#291C0E' }}>{providerName}</span>
            {providerPhone ? (
              <span style={{ fontSize: '13px', color: '#6F473B', fontWeight: '600' }}>
                Contact Phone: {providerPhone}
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: '#A78D78' }}>Contact details available in booking</span>
            )}
          </span>
        </div>
      </div>

      {isPaymentPending && (
        <div className="payment-pending-box">
          <div className="payment-pending-header">
            <span className="service-completed-tag">Service Completed</span>
            <div className="amount-due-display">
              Amount Due: <strong style={{ color: '#291C0E', fontSize: '16px' }}>₹{price}</strong>
            </div>
          </div>

          {paymentError && <div className="payment-error-text">{paymentError}</div>}

          <button
            className="btn btn-pay-now"
            onClick={handlePayNow}
            disabled={isPaying}
          >
            {isPaying ? 'Processing payment...' : `Pay ₹${price}`}
          </button>
        </div>
      )}

      {isCompletedAndPaid && (
        <div className="payment-completed-box">
          <div className="payment-success-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Payment Successful
          </div>
          <div className="payment-paid-info">
            <span>₹{price} Paid</span> • <span className="completed-text">Booking Completed</span>
          </div>
        </div>
      )}

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
        ) : isPaymentPending || isCompletedAndPaid ? (
          <span className="paid-status-tag">
            {paymentStatus === 'Paid' ? 'Paid' : 'Payment Required'}
          </span>
        ) : (
          <span className="no-actions-text">Status: {status}</span>
        )}
      </div>
    </article>
  );
});

export default BookingCard;
