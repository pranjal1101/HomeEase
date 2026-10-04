import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ServiceCard, { CategoryIcon } from '../components/ServiceCard';
import Loader from '../components/Loader';
import './ServiceDetails.css';

const getCategoryFeatures = (category) => {
  switch (category) {
    case 'Plumber':
      return [
        'Leak diagnostics & pipe repairs',
        'Drain clogging clearance',
        'Faucet, sink & fixture installation',
        'Post-service cleanup included',
        'Work satisfaction guarantee'
      ];
    case 'Electrician':
      return [
        'Fully certified electrical experts',
        'Wiring inspections & safety checkups',
        'Short-circuit diagnostic testing',
        'Switchboard & socket repairs',
        'Fully insured service booking'
      ];
    case 'Cleaner':
      return [
        'Deep cleaning & dusting',
        'Vacuuming & floor sanitization',
        'Bathroom & kitchen sanitization',
        'Professional cleaning supplies included',
        'Thorough room deodorizing'
      ];
    case 'Carpenter':
      return [
        'Cabinet fitting & hinge adjustments',
        'Door & window lock alignments',
        'Wall mounting & shelf fitting',
        'Furniture repair work',
        'High-precision wood cuts'
      ];
    case 'Painter':
      return [
        'Multi-coat paint application',
        'Wall surface filling & smoothing',
        'Clean drop cloths protection',
        'Precise taping & edge painting',
        'Zero splatter cleanup guarantee'
      ];
    case 'AC Repair':
      return [
        'Filter cleaning & intake inspection',
        'Refrigerant gas pressure checks',
        'Condenser coil cleaning & service',
        'Thermostat calibration',
        'Power & line safety check'
      ];
    default:
      return [
        'Vetted and background-checked professional',
        'Transparent hourly pricing, no hidden fees',
        'Flexible reschedule and cancel options',
        'Complimentary safety inspection',
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
        <p style={{ color: 'var(--status-cancelled-text)', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
          {error || 'Service not found.'}
        </p>
        <Link to="/services" className="btn btn-primary">
          Back to Services
        </Link>
      </div>
    );
  }

  const { serviceName, category, description, price, availability } = service;
  const features = getCategoryFeatures(category);

  return (
    <div className="container details-wrapper">
      <div className="details-breadcrumb">
        <Link to="/services" className="breadcrumb-back-link">
          Back to services catalog
        </Link>
      </div>

      <div className="details-grid-layout">
        {/* Main Content Column */}
        <div className="details-main-column">
          <div className="details-header-card">
            <div className="details-category-icon">
              <CategoryIcon category={category} />
            </div>
            <div>
              <span className="details-category-pill">{category}</span>
              <h1 className="details-service-title">{serviceName}</h1>
            </div>
          </div>
          
          <div className="details-main-content">
            <div className="details-block">
              <h3>Service Overview</h3>
              <p className="details-description-text">{description}</p>
            </div>

            <div className="details-block">
              <h3>What's Included in This Service</h3>
              <ul className="details-features-list">
                {features.map((feature, idx) => (
                  <li key={idx} className="feature-inclusion-item">
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="details-sticky-sidebar">
          <div className="details-widget-card">
            <div className="widget-header">
              <span className="widget-label">HOURLY RATE</span>
              <div className="widget-price-tag">
                ₹{price}<span> / hr</span>
              </div>
            </div>

            <div className="widget-status-row">
              <span>Status</span>
              <div className={`availability-dot-label ${availability ? 'available' : 'unavailable'}`}>
                {availability ? 'Available Now' : 'Currently Booked'}
              </div>
            </div>

            <div className="widget-summary-card">
              <h4>Booking Breakdown</h4>
              <ul>
                <li>
                  <span>Service Rate</span>
                  <strong>₹{price} / hour</strong>
                </li>
                <li>
                  <span>Booking Fee</span>
                  <strong>₹0.00</strong>
                </li>
                <li className="summary-total-row">
                  <span>Estimated Rate</span>
                  <strong>₹{price} / hour</strong>
                </li>
              </ul>
            </div>

            {availability ? (
              <Link to={`/book/${id}`} className="btn btn-primary widget-book-btn">
                Book This Service
              </Link>
            ) : (
              <button className="btn btn-secondary widget-book-btn" disabled>
                Currently Unavailable
              </button>
            )}

            <p className="widget-helper-note">
              No deposit required. Payment made after job completion.
            </p>
          </div>
        </div>
      </div>

      {relatedServices.length > 0 && (
        <section className="related-section">
          <h3>Other {category} services</h3>
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
