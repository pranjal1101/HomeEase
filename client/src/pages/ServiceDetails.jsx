import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ServiceCard, { CategoryIcon } from '../components/ServiceCard';
import Loader from '../components/Loader';
import './ServiceDetails.css';

// Dynamic feature inclusion lists based on service category
const getCategoryFeatures = (category) => {
  switch (category) {
    case 'Plumber':
      return [
        'Leak diagnostics & plumbing repair',
        'Drain clogging clearance',
        'Faucet, sink & shower installation',
        'Post-service cleanup included',
        '30-day work satisfaction guarantee'
      ];
    case 'Electrician':
      return [
        'Fully certified electrical experts',
        'Wiring inspections & safety checkups',
        'Short-circuit diagnostic testing',
        'Premium quality switches & outlets repair',
        'Fully insured service booking'
      ];
    case 'Cleaner':
      return [
        'Eco-friendly deep cleaning products',
        'Deep vacuuming & surface dusting',
        'Bathroom & kitchen sanitization',
        'Professional cleaning supplies provided',
        'Thorough room deodorizing'
      ];
    case 'Carpenter':
      return [
        'Custom cabinet fitting & adjustments',
        'Door, window hinge & lock alignments',
        'Wall mounting & floating shelves mounting',
        'Premium wood polish finish work',
        'High-precision outline cuts'
      ];
    case 'Painter':
      return [
        'Multi-coat paint application',
        'Wall scraping & wall plaster filling',
        'Clean drop cloths protection',
        'Precise taping & edge painting',
        'Zero spill & paint splatter cleanup guarantee'
      ];
    case 'AC Repair':
      return [
        'Dust filter clean & air intake testing',
        'Refrigerant gas pressure checks',
        'Condenser coil cleaning & service',
        'Thermostat temperature calibrations',
        'Power line energy efficiency checks'
      ];
    default:
      return [
        'Vetted and background-checked professional',
        'Transparent hourly pricing, no hidden fees',
        'Flexible reschedule and cancel options',
        'Complimentary safety checks included',
        'Post-service work warranty protection'
      ];
  }
};

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      document.title = `HomeEase | ${service.serviceName}`;
    } else {
      document.title = 'HomeEase | Service Details';
    }
  }, [service]);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const serviceResponse = await serviceAPI.getById(id);
        if (serviceResponse.success) {
          setService(serviceResponse.data);
          
          const categoryResponse = await serviceAPI.getAll({ 
            category: serviceResponse.data.category, 
            limit: 4 
          });
          if (categoryResponse.success) {
            const filtered = categoryResponse.data.filter(s => s._id !== id);
            setRelatedServices(filtered);
          }
        } else {
          setError(serviceResponse.message || 'Service not found.');
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  if (loading) {
    return (
      <div className="container section-padding">
        <Loader message="Loading service details..." />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--status-cancelled)', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>
          {error || 'Service not found.'}
        </p>
        <Link to="/services" className="btn btn-primary">
          Back to Services
        </Link>
      </div>
    );
  }

  const { serviceName, category, description, price, availability } = service;
  const styleClass = category.replace(/\s+/g, '');
  const features = getCategoryFeatures(category);

  return (
    <div className="container details-wrapper">
      {/* Breadcrumb navigation */}
      <div className="details-breadcrumb">
        <Link to="/services" className="breadcrumb-back-link">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 19"/>
          </svg>
          Back to marketplace
        </Link>
      </div>

      <div className="details-grid-layout">
        {/* Left Side: Illustration, Title, Description, Inclusions */}
        <div className="details-main-column">
          {/* Main graphic banner placeholder matching card styles */}
          <div className={`details-graphic-banner ${styleClass}`}>
            <CategoryIcon category={category} />
          </div>
          
          <div className="details-main-content">
            <span className="details-category-pill">{category}</span>
            <h1 className="details-service-title">{serviceName}</h1>
            
            <div className="details-block">
              <h3>Service Description</h3>
              <p className="details-description-text">{description}</p>
            </div>

            {/* Inclusions checklist */}
            <div className="details-block">
              <h3>What's Included</h3>
              <ul className="details-features-list">
                {features.map((feature, idx) => (
                  <li key={idx} className="feature-inclusion-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Summary widget card */}
        <div className="details-sticky-sidebar">
          <div className="details-widget-card">
            <div className="widget-header">
              <span className="widget-label">RATE</span>
              <div className="widget-price-tag">
                ${price}<span>/hr</span>
              </div>
            </div>

            <div className="widget-status-row">
              <span>Status</span>
              <div className={`availability-dot-label ${availability ? 'available' : 'unavailable'}`}>
                <span className="dot">●</span>
                {availability ? 'Available Now' : 'Currently Booked'}
              </div>
            </div>

            {/* Summary card lists */}
            <div className="widget-summary-card">
              <h4>Booking Summary</h4>
              <ul>
                <li>
                  <span>Service Type</span>
                  <strong>Hourly Rate</strong>
                </li>
                <li>
                  <span>Taxes & Fees</span>
                  <strong>$0.00 (Flat)</strong>
                </li>
                <li className="summary-total-row">
                  <span>Estimated Total</span>
                  <strong>${price} / hour</strong>
                </li>
              </ul>
            </div>

            {availability ? (
              <Link to={`/book/${id}`} className="btn btn-cta widget-book-btn">
                Book Service Now
              </Link>
            ) : (
              <button className="btn btn-secondary widget-book-btn disabled-widget-btn" disabled>
                Currently Unavailable
              </button>
            )}

            <p className="widget-helper-note">
              No reservation fee. Pay after work is completed.
            </p>
          </div>
        </div>
      </div>

      {/* Related Services block */}
      {relatedServices.length > 0 && (
        <section className="related-section">
          <h3>Related services in {category}</h3>
          <div className="grid-3">
            {relatedServices.map(s => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetails;
