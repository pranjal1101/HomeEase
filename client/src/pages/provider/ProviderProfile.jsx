import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { providerAPI, authAPI } from '../../services/api';
import ProviderLayout from '../../components/ProviderLayout';
import './ProviderProfile.css';

const ProviderProfile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    serviceArea: user?.serviceArea || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    isAvailable: user?.isAvailable ?? true
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        serviceArea: user.serviceArea || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        isAvailable: user.isAvailable ?? true
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        serviceArea: formData.serviceArea.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim(),
        isAvailable: formData.isAvailable
      };

      const res = await providerAPI.updateProfile(payload);
      if (res?.success && (res?.user || res?.data)) {
        const updatedUser = res.user || res.data;
        setUser(updatedUser);
        localStorage.setItem('homeease_user', JSON.stringify(updatedUser));
        setSuccessMsg('Profile updated successfully!');
      } else {
        setErrorMsg(res?.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error saving profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProviderLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#49225B' }}>Provider Profile</h1>
        <p style={{ color: '#5A5266', fontSize: '14px', marginTop: '2px' }}>
          Manage your personal details, service locations, bio, and operational availability.
        </p>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#E8F5E9', color: '#1B7B43', border: '1px solid #C8E6C9', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
          {errorMsg}
        </div>
      )}

      <div className="provider-profile-container">
        <div className="profile-sidebar-card">
          <div className="profile-avatar-xl">
            {formData.avatar ? (
              <img src={formData.avatar} alt={formData.name} className="profile-avatar-img" />
            ) : (
              formData.name ? formData.name.charAt(0).toUpperCase() : 'P'
            )}
          </div>
          <div className="profile-name-title">{formData.name || 'Provider Name'}</div>
          <div className="profile-role-tag">Service Provider</div>

          <div style={{ width: '100%', borderTop: '1px solid #EDE4F2', paddingTop: '16px', marginTop: '8px', textAlign: 'left' }}>
            <div style={{ fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: '#7A7285' }}>Email: </span>
              <strong style={{ color: '#1E1B24' }}>{formData.email}</strong>
            </div>
            <div style={{ fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: '#7A7285' }}>Phone: </span>
              <strong style={{ color: '#1E1B24' }}>{formData.phone || 'Not set'}</strong>
            </div>
            <div style={{ fontSize: '13px' }}>
              <span style={{ color: '#7A7285' }}>Status: </span>
              <strong style={{ color: formData.isAvailable ? '#1B7B43' : '#C62828' }}>
                {formData.isAvailable ? 'Available for bookings' : 'Offline / Unavailable'}
              </strong>
            </div>
          </div>
        </div>

        <div className="profile-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section-title">Personal Details</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Provider Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled
                  style={{ backgroundColor: '#F8F4FA', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Profile Photo URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: '20px' }}>Location & Service Area</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Primary Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sector 62, Noida"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Service Coverage Area</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Noida, Greater Noida, Delhi East"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                />
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: '20px' }}>Professional Bio</div>

            <div className="form-group">
              <label>Provider Bio / Description</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Introduce your experience, qualifications, and guarantee of work to prospective customers..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
              <input
                type="checkbox"
                id="profileAvailabilityCheck"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="profileAvailabilityCheck" style={{ margin: 0, cursor: 'pointer', fontWeight: '600', color: '#49225B' }}>
                Available for new bookings
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderProfile;
