import React, { useState, useEffect } from 'react';
import { providerAPI } from '../../services/api';
import ProviderLayout from '../../components/ProviderLayout';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import './ProviderServices.css';

const SERVICE_CATEGORIES = [
  'Plumber',
  'Electrician',
  'Cleaner',
  'Carpenter',
  'Painter',
  'House Helper',
  'AC Repair'
];

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deletingService, setDeletingService] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    serviceName: '',
    category: SERVICE_CATEGORIES[0],
    description: '',
    price: '',
    duration: '1 hour',
    location: '',
    image: '',
    availability: true
  });

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await providerAPI.getServices();
      if (res?.success) {
        setServices(res.data || []);
      } else {
        setError(res?.message || 'Failed to fetch services.');
      }
    } catch (err) {
      console.warn('Backend getServices warning:', err.response?.data?.message || err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      serviceName: '',
      category: SERVICE_CATEGORIES[0],
      description: '',
      price: '',
      duration: '1 hour',
      location: '',
      image: '',
      availability: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      serviceName: service.serviceName || '',
      category: service.category || SERVICE_CATEGORIES[0],
      description: service.description || '',
      price: service.price ?? '',
      duration: service.duration || '1 hour',
      location: service.location || '',
      image: service.image || '',
      availability: service.availability ?? true
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceName || !formData.price || !formData.description) {
      alert('Please fill in all required fields (Service Name, Price, Description).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: formData.duration.trim() || '1 hour',
        location: formData.location.trim(),
        image: formData.image.trim(),
        availability: Boolean(formData.availability)
      };

      if (editingService) {
        const res = await providerAPI.updateService(editingService._id, payload);
        if (res?.success) {
          setIsModalOpen(false);
          fetchServices();
        } else {
          alert(res?.message || 'Failed to update service.');
        }
      } else {
        const res = await providerAPI.createService(payload);
        if (res?.success) {
          setIsModalOpen(false);
          fetchServices();
        } else {
          alert(res?.message || 'Failed to create service.');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error saving service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    setDeleting(true);
    try {
      const res = await providerAPI.deleteService(deletingService._id);
      if (res?.success) {
        setDeletingService(null);
        fetchServices();
      } else {
        alert(res?.message || 'Failed to delete service.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error deleting service.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProviderLayout>
      <div className="services-page-header">
        <div>
          <h1 className="services-page-title">My Services</h1>
          <p style={{ color: '#5A5266', fontSize: '14px', marginTop: '2px' }}>
            Manage and publish home services offered to your local customers.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          + Add Service
        </button>
      </div>

      {loading ? (
        <div className="services-grid">
          <SkeletonLoader height="280px" />
          <SkeletonLoader height="280px" />
          <SkeletonLoader height="280px" />
        </div>
      ) : error ? (
        <div style={{ color: '#C62828', padding: '24px', textAlign: 'center' }}>
          {error}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="You haven't added any services yet."
          message="Create your first service listing so customers can start booking you on HomeEase."
          actionText="+ Add Service"
          onAction={openAddModal}
        />
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service._id} className="provider-service-card">
              <div className="service-card-img-wrapper">
                {service.image ? (
                  <img src={service.image} alt={service.serviceName} className="service-card-img" />
                ) : (
                  <div className="service-img-placeholder">
                    {service.category || 'Home Service'}
                  </div>
                )}
                <span className={`service-availability-badge ${service.availability ? 'active' : 'inactive'}`}>
                  {service.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="service-card-body">
                <div className="service-card-category">{service.category}</div>
                <h3 className="service-card-title">{service.serviceName}</h3>
                <p className="service-card-desc">{service.description}</p>

                <div className="service-meta-row">
                  <div className="service-price">₹{service.price}</div>
                  <div className="service-duration">{service.duration || '1 hour'}</div>
                </div>

                <div className="service-card-footer">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(service)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeletingService(service)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService ? 'Edit Service' : 'Add New Service'}
        >
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Service Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Deep Home Cleaning, AC Gas Refill"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1 hour, 2 hours"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Service Area / Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. South Delhi, Indiranagar"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe what is included in this service..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="availabilityCheck"
                checked={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="availabilityCheck" style={{ margin: 0, cursor: 'pointer', fontWeight: '500' }}>
                Service is available for instant booking
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingService ? 'Save Changes' : 'Add Service'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deletingService && (
        <Modal
          isOpen={!!deletingService}
          onClose={() => setDeletingService(null)}
          title="Delete Service"
        >
          <div style={{ padding: '8px 0' }}>
            <p style={{ color: '#5A5266', marginBottom: '20px', fontSize: '15px' }}>
              Are you sure you want to delete <strong>{deletingService.serviceName}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeletingService(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Service'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </ProviderLayout>
  );
};

export default ProviderServices;
