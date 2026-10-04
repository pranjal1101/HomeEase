import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="footer-logo-box">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="logo-text">Home<span className="logo-highlight">Ease</span></span>
            </div>
            <p className="footer-about">
              Trusted home services on demand. Book verified plumbers, electricians, cleaners, and repair experts.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services Catalog</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
              <li><Link to="/providers">Service Providers</Link></li>
              <li><Link to="/contact">About & Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="footer-col">
            <h4>Service Categories</h4>
            <ul className="footer-links">
              <li><Link to="/services?category=Plumber">Plumbing Repair</Link></li>
              <li><Link to="/services?category=Electrician">Electrical Services</Link></li>
              <li><Link to="/services?category=Cleaner">Deep Home Cleaning</Link></li>
              <li><Link to="/services?category=AC%20Repair">Appliance & AC Repair</Link></li>
              <li><Link to="/services?category=Carpenter">Carpentry & Woodwork</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="footer-contact-list">
              <li>Vadodara, Gujarat, India</li>
              <li>+91 98765 43210</li>
              <li>support@homeease.co</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} HomeEase Technologies Inc. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
