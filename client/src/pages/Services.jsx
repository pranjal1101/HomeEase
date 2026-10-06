import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import AIRecommendationModal from '../components/AIRecommendationModal';
import './Services.css';

const categories = [
  { value: 'All', label: 'All Services' },
  { value: 'Plumber', label: 'Plumbing' },
  { value: 'Electrician', label: 'Electrical' },
  { value: 'Cleaner', label: 'Cleaning' },
  { value: 'Carpenter', label: 'Carpentry' },
  { value: 'Painter', label: 'Painting' },
  { value: 'House Helper', label: 'House Helper' },
  { value: 'AC Repair', label: 'Appliance Repair' }
];

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [sortOrder, setSortOrder] = useState('default');

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const itemsPerPage = 6;

  useEffect(() => {
    document.title = 'HomeEase | Services Marketplace';

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError('');
        
        const filters = {
          page: currentPage,
          limit: itemsPerPage
        };

        if (selectedCategory !== 'All') {
          filters.category = selectedCategory;
        }

        if (searchQuery) {
          filters.search = searchQuery;
        }

        const response = await serviceAPI.getAll(filters);
        if (response.success) {
          setServices(response.data);
        } else {
          setError(response.message || 'Failed to fetch services.');
        }
      } catch (err) {
        console.error('Error fetching services catalog:', err);
        setError('Connection failed. Please check backend status.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, searchQuery, currentPage]);

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const updateParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    
    if (!newParams.page) {
      nextParams.delete('page');
    }

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'All') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const handleCategorySelect = (category) => {
    updateParams({ category, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSortOrder('default');
    setSearchParams({});
  };

  const sortedServicesList = useMemo(() => {
    let list = [...services];
    if (sortOrder === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [services, sortOrder]);

  return (
    <div className="container section-padding">
      <div className="section-header">
        <h2>Services Catalog</h2>
        <p>Browse, filter, and book trusted home service packages.</p>
      </div>

      <div className="marketplace-filters-panel">
        <div className="filters-main-row">
          <form className="marketplace-search-form" onSubmit={handleSearchSubmit}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search service name or keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" className="search-clear-btn" onClick={() => { setSearchInput(''); updateParams({ search: '', page: 1 }); }}>
                ✕
              </button>
            )}
            <button type="submit" className="btn btn-primary search-submit-btn">
              Search
            </button>
          </form>

          <div className="marketplace-sort-select" style={{ gap: '10px' }}>
            <span>Sort by:</span>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAiModalOpen(true)}
              style={{ whiteSpace: 'nowrap' }}
            >
              Ask AI
            </button>
          </div>
        </div>

        <div className="marketplace-chips-row">
          {categories.map((cat) => (
            <button 
              key={cat.value}
              className={`marketplace-chip ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-section">
        {loading ? (
          <div className="grid-3">
            <SkeletonLoader count={6} />
          </div>
        ) : error ? (
          <p className="catalog-error">{error}</p>
        ) : sortedServicesList.length === 0 ? (
          <EmptyState 
            icon=""
            title="No Services Found"
            message="No services matched your active search or category filters."
            actionButton={
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="catalog-header-info">
              <p>Showing <strong>{sortedServicesList.length}</strong> service packages available</p>
            </div>
            
            <div className="grid-3">
              {sortedServicesList.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            <Pagination 
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={services.length < itemsPerPage && currentPage === 1 ? services.length : 12}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>

      <AIRecommendationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
};

export default Services;
