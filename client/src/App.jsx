import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderProtectedRoute from './components/ProviderProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AIRecommendationFloatingBtn from './components/AIRecommendationFloatingBtn';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import BookService from './pages/BookService';
import MyBookings from './pages/MyBookings';
import Providers from './pages/Providers';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderServices from './pages/provider/ProviderServices';
import ProviderBookings from './pages/provider/ProviderBookings';
import ProviderEarnings from './pages/provider/ProviderEarnings';
import ProviderProfile from './pages/provider/ProviderProfile';

const MainContentWrapper = () => {
  const location = useLocation();
  const isProviderRoute = location.pathname.startsWith('/provider/');

  return (
    <div className="main-content-wrapper">
      <main className={isProviderRoute ? "provider-page-content" : "page-content"} style={isProviderRoute ? { padding: 0 } : {}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route 
            path="/book/:serviceId" 
            element={
              <ProtectedRoute>
                <BookService />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/provider/dashboard" 
            element={
              <ProviderProtectedRoute>
                <ProviderDashboard />
              </ProviderProtectedRoute>
            } 
          />
          <Route 
            path="/provider/services" 
            element={
              <ProviderProtectedRoute>
                <ProviderServices />
              </ProviderProtectedRoute>
            } 
          />
          <Route 
            path="/provider/bookings" 
            element={
              <ProviderProtectedRoute>
                <ProviderBookings />
              </ProviderProtectedRoute>
            } 
          />
          <Route 
            path="/provider/earnings" 
            element={
              <ProviderProtectedRoute>
                <ProviderEarnings />
              </ProviderProtectedRoute>
            } 
          />
          <Route 
            path="/provider/profile" 
            element={
              <ProviderProtectedRoute>
                <ProviderProfile />
              </ProviderProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="dashboard-container">
          <Navbar />
          <MainContentWrapper />
          <AIRecommendationFloatingBtn />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
