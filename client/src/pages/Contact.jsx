import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = 'HomeEase | About Us & Contact Support';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert('Please fill out all fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="container section-padding">
      <div className="section-header">
        <h2>About HomeEase & Support</h2>
        <p>Connecting homeowners with background-checked, reliable local service experts.</p>
      </div>

      <section className="about-overview-card">
        <h3>Our Mission</h3>
        <p>
          HomeEase was built to eliminate the stress of finding trustworthy home service professionals. Whether you need an emergency plumber, a skilled electrician, routine cleaning, or house help, HomeEase connects you directly with verified local experts offering upfront hourly rates.
        </p>

        <div className="about-values-grid">
          <div className="value-item">
            <span className="value-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <h4>Vetted & Background-Checked</h4>
              <p>Every service provider undergoes background screening and skill verification.</p>
            </div>
          </div>

          <div className="value-item">
            <span className="value-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <h4>Transparent Hourly Rates</h4>
              <p>No hidden surprise fees or price markups. You know the exact rate upfront.</p>
            </div>
          </div>

          <div className="value-item">
            <span className="value-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <h4>Easy Scheduling</h4>
              <p>Book or reschedule appointments online in seconds without phone calls.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-layout-split">
        <div className="contact-info-column">
          <div className="contact-detail-card">
            <h3>Contact Support</h3>
            <p className="contact-detail-intro">
              Have a question about a booking, service inquiries, or becoming a provider partner? Our support team is here to help.
            </p>
            
            <div className="contact-item-row">
              <div className="contact-item-text">
                <h5>Office Location</h5>
                <p>RC Dutt Road, Alkapuri, Vadodara, Gujarat 390007</p>
              </div>
            </div>

            <div className="contact-item-row">
              <div className="contact-item-text">
                <h5>Helpline & Support Phone</h5>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-item-row">
              <div className="contact-item-text">
                <h5>Email Support</h5>
                <p>support@homeease.co</p>
              </div>
            </div>
          </div>

          <div className="business-hours-card">
            <h3>Operating Hours</h3>
            <ul>
              <li>
                <span>Monday - Saturday</span>
                <strong>8:00 AM - 8:00 PM</strong>
              </li>
              <li>
                <span>Sunday</span>
                <strong>Emergency Helpline Only</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="contact-form-card">
          <h3>Send Us a Message</h3>
          {success ? (
            <div className="contact-success-state">
              <div className="success-icon-badge">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4>Message Delivered!</h4>
              <p>
                Thank you for contacting HomeEase support. Our customer support team will reply within 24 hours.
              </p>
              <button className="btn btn-secondary" onClick={() => setSuccess(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Your Name *</label>
                <input 
                  type="text" 
                  id="contact-name"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address *</label>
                <input 
                  type="email" 
                  id="contact-email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject *</label>
                <input 
                  type="text" 
                  id="contact-subject"
                  className="form-control"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea 
                  id="contact-message"
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Tell us what you need assistance with..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary contact-submit-btn" 
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
