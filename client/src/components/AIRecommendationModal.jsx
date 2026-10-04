import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { aiAPI } from '../services/api';
import './AIRecommendationModal.css';

const categories = [
  'All',
  'Plumber',
  'Electrician',
  'Cleaner',
  'Carpenter',
  'Painter',
  'House Helper',
  'AC Repair'
];

const quickPreferences = [
  'Best overall',
  'Highest rated',
  'Nearby',
  'Affordable',
  'Experienced'
];

const AIRecommendationModal = ({ isOpen, onClose, initialCategory = 'All' }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(initialCategory);
  const [selectedPref, setSelectedPref] = useState('Best overall');
  const [customPref, setCustomPref] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendationData, setRecommendationData] = useState(null);

  // Sync initialCategory when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialCategory && initialCategory !== 'All') {
        setCategory(initialCategory);
      }
    } else {
      // Clear error & previous results on close
      setError('');
    }
  }, [isOpen, initialCategory]);

  const handleGetRecommendation = async (e) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setRecommendationData(null);

      const preference = customPref.trim() ? customPref.trim() : selectedPref;

      const response = await aiAPI.getRecommendation({
        category: category === 'All' ? '' : category,
        preference
      });

      if (response.success && response.data) {
        setRecommendationData(response.data);
      } else {
        setError(response.message || 'Unable to generate recommendation.');
      }
    } catch (err) {
      console.error('Error in AI recommendation:', err);
      const msg = err.response?.data?.message || 'AI recommendation server is temporarily unavailable.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendationData(null);
    setError('');
  };

  const handleViewProvider = (providerId) => {
    onClose();
    navigate(`/services/${providerId}`);
  };

  const handleBookProvider = (providerId) => {
    onClose();
    navigate(`/book/${providerId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Provider Recommendation"
    >
      {!recommendationData && !loading && (
        <form onSubmit={handleGetRecommendation} className="ai-form-section">
          <div>
            <label className="ai-pref-label">Service Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Services' : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="ai-pref-label">What matters most to you?</label>
            <div className="ai-chips-grid">
              {quickPreferences.map((pref) => (
                <button
                  type="button"
                  key={pref}
                  className={`ai-chip-btn ${selectedPref === pref && !customPref ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPref(pref);
                    setCustomPref('');
                  }}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="ai-pref-label">Custom preference (optional):</label>
            <input
              type="text"
              className="form-control ai-custom-input"
              placeholder="e.g., I want someone nearby and affordable"
              value={customPref}
              onChange={(e) => setCustomPref(e.target.value)}
            />
          </div>

          {error && <p className="error-text" style={{ color: '#C62828', fontSize: '13px' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Get AI Recommendation
          </button>
        </form>
      )}

      {loading && (
        <div className="ai-loading-state">
          <div className="ai-spinner"></div>
          <p>AI is comparing candidate providers...</p>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Finding the best match based on real HomeEase database records</span>
        </div>
      )}

      {recommendationData && !loading && (
        <div>
          {recommendationData.notice && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontStyle: 'italic' }}>
              Note: {recommendationData.notice}
            </p>
          )}

          <div className="ai-result-card">
            <div className="ai-result-header">
              <h4 className="ai-result-title">
                {recommendationData.recommendation.provider.serviceName}
              </h4>
              <span className={`status-badge ${recommendationData.recommendation.provider.availability ? 'confirmed' : 'cancelled'}`}>
                {recommendationData.recommendation.provider.availability ? 'Available' : 'Booked'}
              </span>
            </div>

            <div className="ai-provider-meta">
              <span>Category: {recommendationData.recommendation.provider.category}</span>
              <span>Price: ₹{recommendationData.recommendation.provider.price}/hr</span>
            </div>

            <div className="ai-reason-box">
              <strong>WHY THIS RECOMMENDATION?</strong>
              <p>"{recommendationData.recommendation.reason}"</p>
            </div>

            <div className="ai-actions-row">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleViewProvider(recommendationData.recommendation.provider._id)}
                style={{ flex: 1 }}
              >
                View Profile
              </button>

              {recommendationData.recommendation.provider.availability ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleBookProvider(recommendationData.recommendation.provider._id)}
                  style={{ flex: 1 }}
                >
                  Book Now
                </button>
              ) : (
                <button type="button" className="btn btn-secondary btn-sm" disabled style={{ flex: 1 }}>
                  Unavailable
                </button>
              )}
            </div>
          </div>

          {/* Alternatives */}
          {recommendationData.alternatives && recommendationData.alternatives.length > 0 && (
            <div className="ai-alternatives-section">
              <h4>Other good options:</h4>
              {recommendationData.alternatives.map((altItem) => (
                <div key={altItem.provider._id} className="ai-alt-item">
                  <div className="ai-alt-info">
                    <span className="ai-alt-name">{altItem.provider.serviceName} (₹{altItem.provider.price}/hr)</span>
                    <span className="ai-alt-reason">{altItem.reason}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewProvider(altItem.provider._id)}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            style={{ width: '100%', marginTop: '16px' }}
          >
            Search Another Preference
          </button>
        </div>
      )}
    </Modal>
  );
};

export default AIRecommendationModal;
