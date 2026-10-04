import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './Home.css';

// Simple outline icons for homepage features and categories
const HomeIcons = {
  Search: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ArrowRight: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Plumbing: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>
    </svg>
  ),
  Electrical: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Cleaning: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9"/>
    </svg>
  ),
  Carpentry: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Painting: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="6" rx="1"/>
      <path d="M6 9v11a2 2 0 0 2 2 h8a2 2 0 0 0 2-2V9M12 9v13"/>
    </svg>
  ),
  Appliance: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12h8M12 8v8"/>
    </svg>
  ),
  HouseHelp: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  More: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Check: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
};

const categoriesList = [
  { name: 'Electrician', key: 'Electrician', icon: HomeIcons.Electrical },
  { name: 'Plumbing', key: 'Plumber', icon: HomeIcons.Plumbing },
  { name: 'Cleaning', key: 'Cleaner', icon: HomeIcons.Cleaning },
  { name: 'Carpentry', key: 'Carpenter', icon: HomeIcons.Carpentry },
  { name: 'Painting', key: 'Painter', icon: HomeIcons.Painting },
  { name: 'Appliance Repair', key: 'AC Repair', icon: HomeIcons.Appliance },
  { name: 'House Help', key: 'House Helper', icon: HomeIcons.HouseHelp },
  { name: 'All Services', key: 'All', icon: HomeIcons.More }
];

const Home = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HomeEase | Trusted Home Services';

    const fetchPopular = async () => {
      try {
        setLoading(true);
        const response = await serviceAPI.getAll({ page: 1, limit: 6 });
        if (response.success) {
          setPopularServices(response.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Unable to load services at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const handleCategoryClick = (categoryKey) => {
    if (categoryKey === 'All') {
      navigate('/services');
    } else {
      navigate(`/services?category=${encodeURIComponent(categoryKey)}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="home-page-container">
      {/* 1. Compact Hero / Search Section */}
      <section className="hero-search-section">
        <div className="container hero-content">
          <h1 className="hero-title">Find the right service for your home</h1>
          <p className="hero-subtitle">
            Book verified plumbers, electricians, cleaners, and home repair experts in seconds.
          </p>

          <form className="main-search-bar" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <span className="search-input-icon">{HomeIcons.Search}</span>
              <input
                type="text"
                placeholder="Search for a service (e.g. Plumbing, Electrician, Deep Clean)..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary search-submit-btn">
              Search Services
            </button>
          </form>

          <div className="popular-tags">
            <span className="tags-label">Popular searches:</span>
            <button className="tag-link" onClick={() => handleCategoryClick('Plumber')}>Plumber</button>
            <button className="tag-link" onClick={() => handleCategoryClick('Electrician')}>Electrician</button>
            <button className="tag-link" onClick={() => handleCategoryClick('Cleaner')}>Cleaning</button>
            <button className="tag-link" onClick={() => handleCategoryClick('AC Repair')}>AC Repair</button>
          </div>
        </div>
      </section>

      {/* 2. Service Categories */}
      <section className="container categories-section">
        <div className="section-title-row">
          <div>
            <h2>Browse by category</h2>
            <p>Explore professional services tailored to your home needs</p>
          </div>
        </div>

        <div className="categories-grid">
          {categoriesList.map((cat) => (
            <div 
              key={cat.key} 
              className="category-card"
              onClick={() => handleCategoryClick(cat.key)}
            >
              <div className="category-icon-box">
                {cat.icon}
              </div>
              <h3 className="category-name">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Popular Services */}
      <section className="container popular-section">
        <div className="section-title-row">
          <div>
            <h2>Popular services</h2>
            <p>Direct bookings from our verified service providers catalog</p>
          </div>
          <Link to="/services" className="view-all-link">
            View All Services {HomeIcons.ArrowRight}
          </Link>
        </div>

        {loading ? (
          <div className="grid-3">
            <SkeletonLoader count={6} />
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : popularServices.length === 0 ? (
          <p className="empty-message">No services currently available.</p>
        ) : (
          <div className="grid-3">
            {popularServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How HomeEase Works */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>How HomeEase works</h2>
            <p>Simple 4-step process to get quality service delivered to your doorstep</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <h3>Choose a service</h3>
              <p>Select from our comprehensive list of home maintenance and repair services.</p>
            </div>

            <div className="step-card">
              <span className="step-number">2</span>
              <h3>Select a provider</h3>
              <p>Compare ratings, pricing, and availability to pick the right expert.</p>
            </div>

            <div className="step-card">
              <span className="step-number">3</span>
              <h3>Pick a time</h3>
              <p>Schedule appointment date and time convenient for your daily routine.</p>
            </div>

            <div className="step-card">
              <span className="step-number">4</span>
              <h3>Get the service</h3>
              <p>Our verified professional arrives on time and completes the work safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why HomeEase / Trust Section */}
      <section className="container trust-section">
        <div className="trust-box">
          <div className="trust-header">
            <h2>Why homeowners choose HomeEase</h2>
            <p>We connect you with trusted local experts with full pricing transparency.</p>
          </div>

          <div className="trust-features-grid">
            <div className="trust-feature-item">
              <div className="trust-check-circle">{HomeIcons.Check}</div>
              <div>
                <h4>Verified Professionals</h4>
                <p>Every technician undergoes thorough identity and skill verification.</p>
              </div>
            </div>

            <div className="trust-feature-item">
              <div className="trust-check-circle">{HomeIcons.Check}</div>
              <div>
                <h4>Transparent Pricing</h4>
                <p>Clear hourly rates with zero hidden charges or surprise fees.</p>
              </div>
            </div>

            <div className="trust-feature-item">
              <div className="trust-check-circle">{HomeIcons.Check}</div>
              <div>
                <h4>Easy Online Booking</h4>
                <p>Book or reschedule service appointments in less than 2 minutes.</p>
              </div>
            </div>

            <div className="trust-feature-item">
              <div className="trust-check-circle">{HomeIcons.Check}</div>
              <div>
                <h4>Reliable Satisfaction Guarantee</h4>
                <p>Our support team ensures your home service is completed to full satisfaction.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Simple Promotional Banner */}
      <section className="container promo-banner-section">
        <div className="promo-banner">
          <div className="promo-banner-text">
            <h2>Book the help your home needs today</h2>
            <p>Professional home repair and cleaning services available on-demand in Vadodara.</p>
          </div>
          <div className="promo-banner-actions">
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
