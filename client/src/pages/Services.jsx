import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import './Services.css';

const categories = [
  { value: 'All', label: 'All Services' },
  { value: 'Plumber', label: 'Plumbing' },
  { value: 'Electrician', label: 'Electrical' },
  { value: 'Cleaner', label: 'Cleaning' },
  { value: 'Carpenter', label: 'Carpentry' },
  { value: 'Painter', label: 'Painting' },
  { value: 'House Helper', label: 'Pest Control' }, // Map to house helper or general
  { value: 'AC Repair', label: 'Appliance Repair' }
];

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local state mirrors for filters
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price-asc', 'price-desc'

  // Extract params from URL
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const itemsPerPage = 6;

  useEffect(() => {
    document.title = 'HomeEase | Services Catalog';

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
        setError('Connection failed. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, searchQuery, currentPage]);

  // Sync search input with search param changes
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Helper to update URL parameters
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

  // Perform local price sorting
  const getSortedServices = () => {
    let list = [...services];
    if (sortOrder === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  };

  const sortedServicesList = getSortedServices();

  return (
    <div className="container section-padding">
      <div className="section-header">
        <h2>Services Marketplace</h2>
        <p>Find, filter, and book from our verified local home professionals catalog.</p>
      </div>

      {/* Top Filter and Search Control Center */}
      <section className="marketplace-filters-panel">
        <div className="filters-main-row">
          {/* Marketplace Search Input */}
          <form className="marketplace-search-form" onSubmit={handleSearchSubmit}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search services (e.g. plumbing, deep clean, spark)..."
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

          {/* Sort Dropdown */}
          <div className="marketplace-sort-select">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sort-icon">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Chip List Row */}
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
      </section>

      {/* Catalog Display Section */}
      <section className="catalog-section">
        {loading ? (
          <div className="grid-3">
            <SkeletonLoader count={6} />
          </div>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'var(--status-cancelled)', fontWeight: 'bold', margin: '40px 0' }}>{error}</p>
        ) : sortedServicesList.length === 0 ? (
          <EmptyState 
            icon="🔎"
            title="No Services Found"
            message="No service packages matched your query filters. Try a different search term or select another category."
            actionButton={
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="catalog-header-info">
              <p>Showing <strong>{sortedServicesList.length}</strong> service packages available in Vadodara</p>
            </div>
            
            <div className="grid-3">
              {sortedServicesList.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Pagination controls */}
            <Pagination 
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={services.length < itemsPerPage && currentPage === 1 ? services.length : 12}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Services;
