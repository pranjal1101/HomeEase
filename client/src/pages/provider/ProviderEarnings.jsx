import React, { useState, useEffect } from 'react';
import { providerAPI } from '../../services/api';
import ProviderLayout from '../../components/ProviderLayout';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import './ProviderEarnings.css';

const ProviderEarnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await providerAPI.getEarnings();
      if (res?.success) {
        setEarningsData(res.data);
      } else {
        setError(res?.message || 'Failed to load earnings data.');
      }
    } catch (err) {
      console.warn('Backend getEarnings warning:', err.response?.data?.message || err.message);
      setEarningsData({
        totalEarnings: 0,
        thisMonthEarnings: 0,
        pendingPayments: 0,
        completedJobs: 0,
        history: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

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
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#49225B' }}>Earnings</h1>
        <p style={{ color: '#6E3482', fontSize: '14px', marginTop: '2px' }}>
          Overview of revenue generated from completed service bookings.
        </p>
      </div>

      <div className="earnings-notice-banner">
        <strong>Earnings Summary:</strong> Figures below reflect revenue calculated directly from completed customer bookings.
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <SkeletonLoader height="100px" />
          <SkeletonLoader height="100px" />
          <SkeletonLoader height="100px" />
          <SkeletonLoader height="100px" />
        </div>
      ) : error ? (
        <div style={{ color: '#49225B', padding: '24px', textAlign: 'center' }}>
          {error}
        </div>
      ) : (
        <div className="earnings-summary-cards">
          <div className="earnings-card">
            <div className="earnings-card-title">Total Earnings</div>
            <div className="earnings-card-amount">
              ₹{(earningsData?.totalEarnings || 0).toLocaleString()}
            </div>
          </div>

          <div className="earnings-card">
            <div className="earnings-card-title">This Month</div>
            <div className="earnings-card-amount" style={{ color: '#6E3482' }}>
              ₹{(earningsData?.thisMonthEarnings || 0).toLocaleString()}
            </div>
          </div>

          <div className="earnings-card">
            <div className="earnings-card-title">Pending Payments</div>
            <div className="earnings-card-amount" style={{ color: '#49225B' }}>
              ₹{(earningsData?.pendingPayments || 0).toLocaleString()}
            </div>
          </div>

          <div className="earnings-card">
            <div className="earnings-card-title">Completed Jobs</div>
            <div className="earnings-card-amount" style={{ color: '#6E3482' }}>
              {earningsData?.completedJobs || 0}
            </div>
          </div>
        </div>
      )}

      <div className="provider-section-card">
        <div className="provider-section-header">
          <h2 className="provider-section-title">Booking Revenue History</h2>
        </div>

        {loading ? (
          <div style={{ padding: '24px' }}>
            <SkeletonLoader count={4} height="48px" />
          </div>
        ) : !earningsData?.history || earningsData.history.length === 0 ? (
          <EmptyState
            title="No completed jobs yet"
            message="When you accept and mark bookings as completed, your earnings history will appear here."
            actionText="View Bookings"
            actionLink="/provider/bookings"
          />
        ) : (
          <div className="table-responsive">
            <table className="provider-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.history.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {row.customer}
                    </td>
                    <td>
                      {row.service}
                    </td>
                    <td style={{ fontWeight: '700', color: '#49225B' }}>
                      ₹{row.amount}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(row.status)}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderEarnings;
