import * as providerService from '../services/provider.service.js';

export const getDashboard = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const data = await providerService.getProviderDashboard(providerId);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard data.'
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const services = await providerService.getProviderServices(providerId);
    return res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch provider services.'
    });
  }
};

export const createService = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const service = await providerService.createProviderService(providerId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create service.'
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const { id } = req.params;
    const updated = await providerService.updateProviderService(providerId, id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updated
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update service.'
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const { id } = req.params;
    const deleted = await providerService.deleteProviderService(providerId, id);
    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: deleted
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete service.'
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const bookings = await providerService.getProviderBookings(providerId, req.query);
    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings.'
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }
    const updatedBooking = await providerService.updateProviderBookingStatus(providerId, id, status);
    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updatedBooking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update booking status.'
    });
  }
};

export const getEarnings = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const earnings = await providerService.getProviderEarnings(providerId);
    return res.status(200).json({
      success: true,
      data: earnings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch earnings data.'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const providerId = req.user.userId;
    const updatedUser = await providerService.updateProviderProfile(providerId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
      data: updatedUser
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile.'
    });
  }
};
