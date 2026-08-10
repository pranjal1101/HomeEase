import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import SkeletonLoader from '../components/SkeletonLoader';
import heroBg from '../assets/hero.png';
import './Home.css';

// SVG Icons tailored for premium outline styling
const HomeIcons = {
  // Trust Icons
  Verified: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 11 11 13 15 9"/>
    </svg>
  ),
  Clock: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Satisfaction: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),

  // Calendar outline
  Calendar: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),

  // Step Icons
  StepSearch: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  StepChoose: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <polyline points="17 11 19 13 23 9"/>
    </svg>
  ),
  StepBook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  StepRelax: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),

  // Search Icon
  Search: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),

  // Arrow right
  ArrowRight: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),

  // Service categories outline icons
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
      <path d="M6 9v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9M12 9v13"/>
    </svg>
  ),
  Appliance: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <circle cx="12" cy="14" r="4"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
    </svg>
  ),
  Pest: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6"/>
      <path d="M12 6V3M12 21v-3M6 12H3M21 12h-3M7.75 7.75L5.6 5.6M18.4 18.4l-2.15-2.15M18.4 5.6l-2.15 2.15M7.75 16.25L5.6 18.4"/>
    </svg>
  ),
  More: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
};

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HomeEase | Trusted Home Services On Demand';

    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await serviceAPI.getAll({ page: 1, limit: 3 });
        if (response.success) {
          setFeaturedServices(response.data);
        }
      } catch (err) {
        console.error('Error loading featured services:', err);
        setError('Unable to fetch services at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/services?category=${encodeURIComponent(categoryName)}`);
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="home-page-wrapper">
      {/* 1. Hero Section (Lavender Background, Curved/Clean Separator) */}
      <section className="hero-section">
        <div className="container hero-layout-split">
          {/* Hero Left: Heading, Badge, Description, Search, Buttons, Trust */}
          <div className="hero-left-welcome">
            <div className="priority-badge">
              <span className="badge-shield-icon">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 11 11 13 15 9"/>
                </svg>
              </span>
              <span>Your Home, Our Priority</span>
            </div>
            
            <h1 className="hero-main-title">
              Home services,<br />
              <span className="title-highlight">made easy</span>
            </h1>
            
            <p className="hero-subtext">
              Book trusted professionals for your home in just a few clicks.
            </p>

            {/* Vertically Centered Search Bar */}
            <form className="hero-search-bar" onSubmit={handleHeroSearch}>
              <input
                type="text"
                placeholder="What service do you need today?"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <button type="submit" className="search-circle-btn" aria-label="Search">
                {HomeIcons.Search}
              </button>
            </form>

            <div className="hero-cta-buttons">
              <Link to="/services" className="btn btn-primary hero-btn-book">
                Book a Service
              </Link>
              <Link to="/services" className="btn btn-secondary hero-btn-browse">
                Browse Services
              </Link>
            </div>

            {/* Trust indicators (Plain SVG icons with no extra background) */}
            <div className="hero-stats-row">
              <div className="stat-metric-item">
                <span className="stat-icon-plain verified-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 11 11 13 15 9"/>
                  </svg>
                </span>
                <p>Verified Professionals</p>
              </div>

              <div className="stat-metric-item">
                <span className="stat-icon-plain clock-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <p>On-time Service</p>
              </div>

              <div className="stat-metric-item">
                <span className="stat-icon-plain satisfaction-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </span>
                <p>Satisfaction Guaranteed</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Premium sofa illustration only */}
          <div className="hero-right-illustration">
            <img src={heroBg} alt="Premium Living Room Sofa" className="hero-sofa-bg" />
          </div>
        </div>
      </section>

      {/* 2. Popular Services (Horizontal row of 8 items, large white rounded card) */}
      <section className="container popular-services-section">
        <div className="popular-header-row">
          <h3>Popular Services</h3>
          <Link to="/services" className="view-all-link">
            View All Services {HomeIcons.ArrowRight}
          </Link>
        </div>

        <div className="popular-services-card">
          <div className="popular-category-item" onClick={() => handleCategoryClick('Plumber')}>
            <div className="category-icon-circle plumbing">{HomeIcons.Plumbing}</div>
            <span>Plumbing</span>
          </div>

          <div className="popular-category-item" onClick={() => handleCategoryClick('Electrician')}>
            <div className="category-icon-circle electrical">{HomeIcons.Electrical}</div>
            <span>Electrical</span>
          </div>

          <div className="popular-category-item" onClick={() => handleCategoryClick('Cleaner')}>
            <div className="category-icon-circle cleaning">{HomeIcons.Cleaning}</div>
            <span>Cleaning</span>
          </div>

          <div className="popular-category-item" onClick={() => handleCategoryClick('Carpenter')}>
            <div className="category-icon-circle carpentry">{HomeIcons.Carpentry}</div>
            <span>Carpentry</span>
          </div>

          <div className="popular-category-item" onClick={() => handleCategoryClick('Painter')}>
            <div className="category-icon-circle painting">{HomeIcons.Painting}</div>
            <span>Painting</span>
          </div>

          <div className="popular-category-item" onClick={() => handleCategoryClick('AC Repair')}>
            <div className="category-icon-circle appliance">{HomeIcons.Appliance}</div>
            <span>Appliance Repair</span>
          </div>

          <div className="popular-category-item" onClick={() => handleCategoryClick('House Helper')}>
            <div className="category-icon-circle pest">{HomeIcons.Pest}</div>
            <span>Pest Control</span>
          </div>

          <div className="popular-category-item" onClick={() => navigate('/services')}>
            <div className="category-icon-circle more">{HomeIcons.More}</div>
            <span>More</span>
          </div>
        </div>
      </section>

      {/* 3. How HomeEase Works & Promo Cards split section */}
      <section className="container split-dashboard-sections">
        {/* Left Column: How HomeEase Works Card */}
        <div className="how-works-dashboard-card">
          <h3>How HomeEase Works</h3>
          
          <div className="how-works-vertical-steps">
            {/* Step 1 */}
            <div className="how-works-step-row">
              <div className="step-number-circle">1</div>
              <div className="step-icon-square">
                {HomeIcons.StepSearch}
              </div>
              <div className="step-text-details">
                <h4>Search</h4>
                <p>Find the service you need</p>
              </div>
            </div>

            <div className="step-arrow-line">
              <div className="vertical-connector"></div>
            </div>

            {/* Step 2 */}
            <div className="how-works-step-row">
              <div className="step-number-circle">2</div>
              <div className="step-icon-square">
                {HomeIcons.StepChoose}
              </div>
              <div className="step-text-details">
                <h4>Choose Professional</h4>
                <p>Select from verified professionals</p>
              </div>
            </div>

            <div className="step-arrow-line">
              <div className="vertical-connector"></div>
            </div>

            {/* Step 3 */}
            <div className="how-works-step-row">
              <div className="step-number-circle">3</div>
              <div className="step-icon-square">
                {HomeIcons.StepBook}
              </div>
              <div className="step-text-details">
                <h4>Book</h4>
                <p>Pick a convenient time & date</p>
              </div>
            </div>

            <div className="step-arrow-line">
              <div className="vertical-connector"></div>
            </div>

            {/* Step 4 */}
            <div className="how-works-step-row">
              <div className="step-number-circle">4</div>
              <div className="step-icon-square">
                {HomeIcons.StepRelax}
              </div>
              <div className="step-text-details">
                <h4>Relax</h4>
                <p>Get the job done worry-free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stored Promo Cards */}
        <div className="promotional-column">
          {/* Promo Card 1: Flat 20% OFF */}
          <div className="promo-card primary-promo">
            <div className="promo-content">
              <span className="promo-badge">FIRST BOOKING</span>
              <h3>Flat 20% OFF</h3>
              <p>On your first service booking with HomeEase</p>
              
              <div className="promo-code-container">
                <span className="promo-code">FIRST20</span>
                <button className="promo-btn" onClick={() => {
                  navigator.clipboard.writeText('FIRST20');
                  alert('Code FIRST20 copied to clipboard!');
                }}>
                  Copy
                </button>
              </div>
            </div>
            
            {/* Outline Gift Box Graphic */}
            <div className="promo-graphic-svg">
              <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="22" x2="12" y2="7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </div>
          </div>

          {/* Promo Card 2: Refer & Earn Rewards */}
          <div className="promo-card secondary-promo">
            <div className="promo-content">
              <h3>Refer & Earn Rewards</h3>
              <p>Invite friends and earn exciting rewards up to $50 credit per referral</p>
            </div>
            <Link to="/profile" className="promo-circle-arrow-btn">
              {HomeIcons.ArrowRight}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Services */}
      <section className="container featured-catalog-summary">
        <div className="featured-section-header">
          <h3>Featured Services</h3>
          <p>Book from our top-rated professional packages with verified upfront pricing.</p>
        </div>

        {loading ? (
          <div className="grid-3">
            <SkeletonLoader count={3} />
          </div>
        ) : error ? (
          <p className="featured-error-msg">{error}</p>
        ) : featuredServices.length === 0 ? (
          <p className="featured-empty-msg">No featured services found.</p>
        ) : (
          <div className="grid-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        <div className="featured-bottom-cta">
          <Link to="/services" className="btn btn-secondary">
            View All Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
