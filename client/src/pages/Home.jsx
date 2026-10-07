import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import homeCutawayImg from '../assets/home-cutaway.jpg';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const aiInputRef = useRef(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    document.title = 'HomeEase | A happier home starts with the right help';
  }, []);

  const hotspots = [
    {
      id: 'bathroom',
      title: 'Bathroom',
      services: 'Plumbing / Cleaning',
      subtitle: 'Bathroom',
      style: { top: '34%', left: '4%' },
      dotOffset: { top: '40%', left: '26%' },
      roomServices: [
        { label: 'Plumbing & Tap Repair', category: 'Plumber' },
        { label: 'Deep Bathroom Cleaning', category: 'Cleaner' }
      ],
      aiPreset: 'My bathroom tap is leaking and geyser is not heating water'
    },
    {
      id: 'bedroom',
      title: 'Bedroom',
      services: 'AC / Electrical',
      subtitle: 'Bedroom',
      style: { top: '8%', left: '36%' },
      dotOffset: { top: '18%', left: '48%' },
      roomServices: [
        { label: 'AC Service & Cooling Check', category: 'AC Repair' },
        { label: 'Switchboard & Socket Wiring', category: 'Electrician' }
      ],
      aiPreset: 'The bedroom AC is not cooling properly and fan is noisy'
    },
    {
      id: 'exterior',
      title: 'Exterior',
      services: 'Painting / Repairs',
      subtitle: 'Exterior',
      style: { top: '8%', right: '4%' },
      dotOffset: { top: '18%', right: '14%' },
      roomServices: [
        { label: 'Exterior Wall Painting', category: 'Painter' },
        { label: 'Balcony & Door Repairs', category: 'Carpenter' }
      ],
      aiPreset: 'Exterior wall paint is peeling and balcony door lock is stuck'
    },
    {
      id: 'kitchen',
      title: 'Kitchen',
      services: 'Plumbing / Appliance Repair',
      subtitle: 'Kitchen',
      style: { bottom: '22%', left: '4%' },
      dotOffset: { bottom: '28%', left: '30%' },
      roomServices: [
        { label: 'Sink Plumbing & Tap Repair', category: 'Plumber' },
        { label: 'Chimney & Appliance Service', category: 'AC Repair' }
      ],
      aiPreset: 'My kitchen tap is leaking and water is collecting under sink'
    },
    {
      id: 'living',
      title: 'Living Area',
      services: 'Cleaning / Painting',
      subtitle: 'Living Area',
      style: { bottom: '20%', right: '4%' },
      dotOffset: { bottom: '26%', right: '22%' },
      roomServices: [
        { label: 'Deep Sofa & Floor Cleaning', category: 'Cleaner' },
        { label: 'Wall Touch-up Painting', category: 'Painter' }
      ],
      aiPreset: 'Need deep sofa cleaning and touch-up painting for living room'
    }
  ];

  const processAIRecommendation = (queryText) => {
    const q = queryText.toLowerCase();

    if (q.includes('tap') || q.includes('leak') || q.includes('pipe') || q.includes('water') || q.includes('sink') || q.includes('drain') || q.includes('faucet')) {
      return {
        service: 'Plumbing & Repairs',
        category: 'Plumber',
        providerName: 'Manoj Verma',
        company: 'QuickFix Plumbers',
        rating: '4.5',
        exp: '4 years experience',
        rate: '₹400/hr',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
      };
    }

    if (q.includes('fan') || q.includes('switch') || q.includes('wiring') || q.includes('light') || q.includes('socket') || q.includes('electricity') || q.includes('short')) {
      return {
        service: 'Electrical Services',
        category: 'Electrician',
        providerName: 'Anil Kumar',
        company: 'Premium Electrical Services',
        rating: '4.9',
        exp: '6 years experience',
        rate: '₹850/hr',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
      };
    }

    if (q.includes('clean') || q.includes('dust') || q.includes('bathroom') || q.includes('kitchen cleaning') || q.includes('deep clean') || q.includes('sofa')) {
      return {
        service: 'Cleaning Services',
        category: 'Cleaner',
        providerName: 'Priya Cleaning Solutions',
        company: 'HomeEase Sparkle Clean',
        rating: '4.8',
        exp: '5 years experience',
        rate: '₹500/hr',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
      };
    }

    if (q.includes('paint') || q.includes('wall') || q.includes('colour') || q.includes('renovation')) {
      return {
        service: 'Painting & Renovation',
        category: 'Painter',
        providerName: 'Ramesh Craftsmen',
        company: 'ColorTouch Paints',
        rating: '4.7',
        exp: '7 years experience',
        rate: '₹600/hr',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      };
    }

    if (q.includes('ac') || q.includes('air conditioner') || q.includes('cooling') || q.includes('gas') || q.includes('fridge')) {
      return {
        service: 'AC & Appliance Repair',
        category: 'AC Repair',
        providerName: 'Deepak Saini',
        company: 'Spark Electricals & AC',
        rating: '4.4',
        exp: '3 years experience',
        rate: '₹450/hr',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
      };
    }

    return {
      service: 'Plumbing & Repairs',
      category: 'Plumber',
      providerName: 'Manoj Verma',
      company: 'QuickFix Plumbers',
      rating: '4.5',
      exp: '4 years experience',
      rate: '₹400/hr',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    };
  };

  const handleAISubmit = (e) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;
    const result = processAIRecommendation(aiQuery);
    setAiRecommendation(result);
  };

  const handlePresetClick = (presetText) => {
    setAiQuery(presetText);
    const result = processAIRecommendation(presetText);
    setAiRecommendation(result);
    if (aiInputRef.current) {
      aiInputRef.current.focus();
    }
  };

  const handleHotspotClick = (spot) => {
    if (activeHotspot?.id === spot.id) {
      setActiveHotspot(null);
    } else {
      setActiveHotspot(spot);
    }
  };

  return (
    <div className="home-landing-page">
      <section className="container hero-section-desktop">
        <div className="hero-grid-desktop">
          <div className="hero-left-content">
            <h1 className="hero-main-title">
              A happier home starts<br />with the right help.
            </h1>

            <p className="hero-sub-title">
              From leaky taps to faulty switches, HomeEase connects you with trusted local professionals for all your home service needs.
            </p>

            <div className="ai-recommendation-box">
              <div className="ai-box-header">
                <div className="ai-box-label">
                  <span>AI Home Recommendation</span>
                </div>
              </div>

              <div className="ai-box-sub">Not sure what service you need?</div>

              <form onSubmit={handleAISubmit}>
                <div className="ai-input-wrapper">
                  <textarea
                    ref={aiInputRef}
                    rows="2"
                    className="ai-input-field"
                    placeholder="Tell us what's happening at home..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                  />
                  <button type="submit" className="ai-submit-btn" aria-label="Submit AI Recommendation">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="ai-helper-text">
                Describe the problem in your own words.
              </div>

              <div 
                className="ai-preset-chip" 
                onClick={() => handlePresetClick('My kitchen tap is leaking and water is collecting under sink')}
              >
                "My kitchen tap is leaking and water is collecting under sink"
              </div>

              {aiRecommendation && (
                <div className="ai-result-card">
                  <div className="ai-result-title">Looks like you need</div>
                  <div className="ai-result-service">{aiRecommendation.service}</div>
                  
                  <div className="ai-result-provider-box">
                    <img src={aiRecommendation.avatar} alt={aiRecommendation.providerName} className="ai-result-avatar" />
                    <div style={{ flex: 1 }}>
                      <div className="ai-result-p-name">{aiRecommendation.providerName}</div>
                      <div className="ai-result-p-meta">
                        <span style={{ color: '#6F473B', fontWeight: '700' }}>Rating: {aiRecommendation.rating}</span> · {aiRecommendation.exp}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '4px', width: '100%' }}
                    onClick={() => navigate(`/services?category=${encodeURIComponent(aiRecommendation.category)}`)}
                  >
                    View Recommendation &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="hero-right-visual">
            <div className="home-image-wrapper">
              <img
                src={homeCutawayImg}
                alt="HomeEase House Model"
                className="home-main-img"
              />

              {hotspots.map((spot) => (
                <React.Fragment key={spot.id}>
                  <div
                    className={`home-hotspot-card ${activeHotspot?.id === spot.id ? 'active' : ''}`}
                    style={spot.style}
                    onClick={() => handleHotspotClick(spot)}
                  >
                    <div className="hotspot-icon-circle">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <div className="hotspot-info-text">
                      <span className="hotspot-title">{spot.services}</span>
                      <span className="hotspot-services-sub">{spot.subtitle}</span>
                    </div>
                  </div>

                  <div 
                    className="hotspot-room-dot"
                    style={spot.dotOffset}
                    onClick={() => handleHotspotClick(spot)}
                  />

                  {activeHotspot?.id === spot.id && (
                    <div 
                      className="hotspot-context-panel" 
                      style={{
                        top: spot.style.top ? `calc(${spot.style.top} + 46px)` : 'auto',
                        bottom: spot.style.bottom ? `calc(${spot.style.bottom} + 46px)` : 'auto',
                        left: spot.style.left || 'auto',
                        right: spot.style.right || 'auto'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="context-panel-header">{spot.title} Services</div>
                      {spot.roomServices.map((rs, idx) => (
                        <div
                          key={idx}
                          className="context-service-item"
                          onClick={() => navigate(`/services?category=${encodeURIComponent(rs.category)}`)}
                        >
                          <span>{rs.label}</span>
                          <span>&rarr;</span>
                        </div>
                      ))}
                      <button
                        className="context-ai-ask-btn"
                        onClick={() => {
                          setActiveHotspot(null);
                          handlePresetClick(spot.aiPreset);
                        }}
                      >
                        Ask HomeEase AI &rarr;
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container popular-section-block">
        <div className="section-header-row">
          <div>
            <h2>Popular Services</h2>
            <p>Quick fixes to major home needs — book trusted professionals in minutes.</p>
          </div>
        </div>

        <div className="popular-tiles-grid">
          <Link to="/services?category=Electrician" className="popular-tile-card">
            <div className="tile-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                alt="Electrical Services"
                className="tile-img"
              />
            </div>
            <div className="tile-content-box">
              <div className="tile-badge-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div>
                <h3 className="tile-title">Electrical Services</h3>
                <p className="tile-desc">Repairs, installations, rewiring & safety checks.</p>
              </div>
              <div className="tile-footer-arrow">&rarr;</div>
            </div>
          </Link>

          <Link to="/services?category=Plumber" className="popular-tile-card">
            <div className="tile-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80"
                alt="Plumbing Services"
                className="tile-img"
              />
            </div>
            <div className="tile-content-box">
              <div className="tile-badge-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="tile-title">Plumbing Services</h3>
                <p className="tile-desc">Leaks, fittings, drainage & geyser repair.</p>
              </div>
              <div className="tile-footer-arrow">&rarr;</div>
            </div>
          </Link>

          <Link to="/services?category=Cleaner" className="popular-tile-card">
            <div className="tile-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
                alt="Cleaning Services"
                className="tile-img"
              />
            </div>
            <div className="tile-content-box">
              <div className="tile-badge-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <h3 className="tile-title">Cleaning Services</h3>
                <p className="tile-desc">Deep cleaning, regular house cleaning & sofa care.</p>
              </div>
              <div className="tile-footer-arrow">&rarr;</div>
            </div>
          </Link>
        </div>
      </section>

      <section className="container providers-section-block">
        <div className="section-header-row">
          <div>
            <h2>Trusted Providers</h2>
            <p>Verified professionals. Fair pricing. Real reviews.</p>
          </div>
          <Link to="/providers" className="view-all-link">
            View all providers &rarr;
          </Link>
        </div>

        <div className="provider-cards-grid">
          <div className="compact-provider-card">
            <div className="provider-photo-box">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Anil Kumar" />
            </div>
            <div className="provider-details-info">
              <div className="provider-header-line">
                <span className="provider-p-name">Anil Kumar</span>
                <span className="verified-pill">Verified</span>
              </div>
              <div className="provider-p-company">Premium Electrical Services</div>
              <div className="provider-p-stats">
                <span className="provider-p-rating">Rating: 4.9</span>
                <span>• 6 yrs exp</span>
              </div>
              <div className="provider-card-bottom">
                <Link to="/services" className="btn btn-secondary btn-sm">Book Now</Link>
              </div>
            </div>
          </div>

          <div className="compact-provider-card">
            <div className="provider-photo-box">
              <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80" alt="Deepak Saini" />
            </div>
            <div className="provider-details-info">
              <div className="provider-header-line">
                <span className="provider-p-name">Deepak Saini</span>
                <span className="verified-pill">Verified</span>
              </div>
              <div className="provider-p-company">Spark Electricals</div>
              <div className="provider-p-stats">
                <span className="provider-p-rating">Rating: 4.5</span>
                <span>• 5 yrs exp</span>
              </div>
              <div className="provider-card-bottom">
                <Link to="/services" className="btn btn-secondary btn-sm">Book Now</Link>
              </div>
            </div>
          </div>

          <div className="compact-provider-card">
            <div className="provider-photo-box">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Manoj Verma" />
            </div>
            <div className="provider-details-info">
              <div className="provider-header-line">
                <span className="provider-p-name">Manoj Verma</span>
                <span className="verified-pill">Verified</span>
              </div>
              <div className="provider-p-company">QuickFix Plumbers</div>
              <div className="provider-p-stats">
                <span className="provider-p-rating">Rating: 4.5</span>
                <span>• 4 yrs exp</span>
              </div>
              <div className="provider-card-bottom">
                <Link to="/services" className="btn btn-secondary btn-sm">Book Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
