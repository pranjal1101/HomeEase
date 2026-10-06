import * as bookingService from '../services/booking.service.js';

export const createBooking = async (req, res) => {
  try {
    const bookingData = { ...req.body };
    if (req.user && req.user.userId) {
      bookingData.userId = req.user.userId;
    }
    const booking = await bookingService.createBooking(bookingData);
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { serviceId, status } = req.query;
    let userId = req.query.userId;
    
    if (req.user && req.user.role !== 'admin') {
      userId = req.user.userId;
    }

    const bookings = await bookingService.getAllBookings({ userId, serviceId, status });
    return res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);

    if (req.user && req.user.role !== 'admin') {
      const ownerId = booking.userId?._id ? booking.userId._id.toString() : booking.userId?.toString();
      if (ownerId && ownerId !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own bookings.'
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Booking details fetched successfully',
      data: booking
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user && req.user.role !== 'admin') {
      const booking = await bookingService.getBookingById(id);
      const ownerId = booking.userId?._id ? booking.userId._id.toString() : booking.userId?.toString();
      if (ownerId && ownerId !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own bookings.'
        });
      }
    }

    const updatedBooking = await bookingService.updateBooking(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.role !== 'admin') {
      const booking = await bookingService.getBookingById(id);
      const ownerId = booking.userId?._id ? booking.userId._id.toString() : booking.userId?.toString();
      if (ownerId && ownerId !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only cancel your own bookings.'
        });
      }
    }

    const deletedBooking = await bookingService.deleteBooking(id);
    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: deletedBooking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
