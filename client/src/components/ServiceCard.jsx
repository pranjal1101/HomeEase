import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

// Crisp, outline SVGs for each category
const CategoryIcon = ({ category }) => {
  const strokeColor = 'currentColor';
  
  switch (category) {
    case 'Plumber':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>
        </svg>
      );
    case 'Electrician':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      );
    case 'Cleaner':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9"/>
        </svg>
      );
    case 'Carpenter':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      );
    case 'Painter':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="6" rx="1"/>
          <path d="M6 9v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9M12 9v13"/>
        </svg>
      );
    case 'House Helper':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      );
    case 'AC Repair':
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8M12 8v8M9.17 9.17l5.66 5.66M14.83 9.17l-5.66 5.66"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      );
  }
};

const ServiceCard = ({ service }) => {
  const { _id, serviceName, category, description, price, availability } = service;
  const styleClass = category.replace(/\s+/g, '');

  return (
    <article className="service-card">
      <div className={`service-card-image-placeholder ${styleClass}`}>
        <CategoryIcon category={category} />
      </div>
      
      <div className="service-card-content">
        <div className="service-card-header-row">
          <span className="service-card-category">{category}</span>
          <span className={`service-card-availability ${availability ? 'available' : 'unavailable'}`}>
            <span className="dot">●</span> {availability ? 'Available' : 'Booked'}
          </span>
        </div>
        
        <h3 className="service-card-title">{serviceName}</h3>
        <p className="service-card-desc">{description}</p>
        
        <div className="service-card-footer">
          <div className="service-card-price">
            ${price}<span>/hr</span>
          </div>
          
          <div className="service-card-actions">
            <Link to={`/services/${_id}`} className="btn btn-secondary card-action-btn">
              Details
            </Link>
            {availability ? (
              <Link to={`/book/${_id}`} className="btn btn-primary card-action-btn highlight">
                Book
              </Link>
            ) : (
              <button className="btn btn-secondary card-action-btn disabled-btn" disabled>
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
export { CategoryIcon };
