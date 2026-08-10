import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    document.title = 'HomeEase | Contact Support';
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
    }, 1200);
  };

  const svgColor = 'var(--primary)';

  return (
    <div className="container section-padding">
      <div className="section-header">
        <h2>Support & Contact</h2>
        <p>Have questions about home services, booking issues, or joining as a professional? Let us know.</p>
      </div>

      <div className="contact-layout-split">
        {/* Left Column: Support info cards & map mockup */}
        <div className="contact-info-column">
          {/* Card 1: Support detail card */}
          <div className="contact-detail-card">
            <h3>Support Center</h3>
            <p className="contact-detail-intro">Reach out to our team directly. We are happy to assist with any questions.</p>
            
            <div className="contact-item-row">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={svgColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="contact-item-text">
                <h5>Office Location</h5>
                <p>100 Startup Hub, Suite 400, Silicon Valley, CA</p>
              </div>
            </div>

            <div className="contact-item-row">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={svgColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div className="contact-item-text">
                <h5>Phone Number</h5>
                <p>+1 (555) 987-6543</p>
              </div>
            </div>

            <div className="contact-item-row">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={svgColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="contact-item-text">
                <h5>Email Address</h5>
                <p>hello@homeease.co</p>
              </div>
            </div>
          </div>

          {/* Card 2: Business Hours card */}
          <div className="business-hours-card">
            <div className="hours-header-row">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h3>Business Hours</h3>
            </div>
            <ul>
              <li>
                <span>Monday - Friday</span>
                <strong>9:00 AM - 6:00 PM</strong>
              </li>
              <li>
                <span>Saturday</span>
                <strong>10:00 AM - 4:00 PM</strong>
              </li>
              <li>
                <span>Sunday</span>
                <strong>Emergency Helpline Only</strong>
              </li>
            </ul>
          </div>

          {/* Simple Map Placeholder */}
          <div className="map-mockup-widget">
            <div className="map-mockup-pin">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="var(--primary)" stroke="var(--white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3" fill="var(--white)"/>
              </svg>
            </div>
            <div className="map-mockup-pulse-ring"></div>
            <span className="map-caption">Silicon Valley Staging HQ</span>
          </div>
        </div>

        {/* Right Column: Contact support message form card */}
        <div className="contact-form-card">
          <h3 className="form-card-title">Send Us a Message</h3>
          {success ? (
            <div className="contact-success-state">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--status-completed)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h4>Message Sent!</h4>
              <p>
                Thank you for contacting HomeEase support. Our customer success team will get back to you within 24 hours.
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
                  rows="5"
                  required
                  placeholder="Tell us what you need help with..."
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
