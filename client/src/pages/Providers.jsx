import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import AIRecommendationModal from '../components/AIRecommendationModal';
import './Providers.css';

const categoryOptions = [
  { value: 'All', label: 'All Categories' },
  { value: 'Plumber', label: 'Plumbing' },
  { value: 'Electrician', label: 'Electrical' },
  { value: 'Cleaner', label: 'Cleaning' },
  { value: 'Carpenter', label: 'Carpentry' },
  { value: 'Painter', label: 'Painting' },
  { value: 'AC Repair', label: 'Appliance Repair' },
  { value: 'House Helper', label: 'House Helper' }
];

const Providers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    document.title = 'HomeEase | Service Providers Directory';

    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError('');
        
        const params = {};
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchInput) {
          params.search = searchInput;
        }

        const response = await serviceAPI.getAll(params);
        if (response.success) {
          setServices(response.data);
        } else {
          setError(response.message || 'Failed to load providers.');
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Unable to load service providers.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [selectedCategory, searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set('search', searchInput.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="container section-padding">
      <div className="section-header">
        <h2>Service Providers Directory</h2>
        <p>Browse verified, background-checked home service professionals in your area.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="providers-filter-bar">
        <form className="providers-search-form" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search provider name or service..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="providers-category-select">
          <select 
            value={selectedCategory} 
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="form-control"
          >
            {categoryOptions.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => setIsAiModalOpen(true)}
          style={{ whiteSpace: 'nowrap' }}
        >
          Ask AI
        </button>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="grid-3">
          <SkeletonLoader count={6} />
        </div>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : services.length === 0 ? (
        <EmptyState 
          icon=""
          title="No Providers Found"
          message="No service providers match your search criteria."
          actionButton={
            <button className="btn btn-secondary" onClick={() => { setSearchInput(''); setSearchParams({}); }}>
              Reset Search
            </button>
          }
        />
      ) : (
        <div className="grid-3">
          {services.map((item) => (
            <div key={item._id} className="provider-card">
              <div className="provider-card-header">
                <div className="provider-avatar">
                  {item.serviceName.charAt(0).toUpperCase()}
                </div>
                <div className="provider-badge-info">
                  <span className="verified-badge">Verified Partner</span>
                  <span className={`availability-badge ${item.availability ? 'available' : 'booked'}`}>
                    {item.availability ? 'Available' : 'Booked'}
                  </span>
                </div>
              </div>

              <div className="provider-card-body">
                <h3 className="provider-name">{item.serviceName}</h3>
                <p className="provider-category-tag">{item.category} Specialist</p>
                <p className="provider-desc">{item.description}</p>
                
                <div className="provider-meta-row">
                  <span className="meta-item">Vadodara, Gujarat</span>
                </div>
              </div>

              <div className="provider-card-footer">
                <div className="provider-rate">
                  ₹{item.price}<span className="unit">/hr</span>
                </div>

                <div className="provider-actions">
                  <Link to={`/services/${item._id}`} className="btn btn-secondary btn-sm">
                    Profile
                  </Link>
                  {item.availability ? (
                    <Link to={`/book/${item._id}`} className="btn btn-primary btn-sm">
                      Book Service
                    </Link>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AIRecommendationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
};

export default Providers;
