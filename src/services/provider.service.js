import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Booking from '../models/booking.model.js';
import { BOOKING_STATUS } from '../constants.js';
import { createNotification } from './notification.service.js';

export const getProviderDashboard = async (providerId) => {
  const provider = await User.findById(providerId).select('-password').lean();
  if (!provider) {
    throw new Error('Provider not found');
  }

  const services = await Service.find({ $or: [{ providerId }, { providerId: null }] }).lean();
  const serviceIds = services.map((s) => s._id);

  const bookings = await Booking.find({ serviceId: { $in: serviceIds } })
    .sort({ createdAt: -1 })
    .populate({ path: 'userId', select: 'name email phone' })
    .populate({ path: 'serviceId', select: 'serviceName category price' })
    .lean();

  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter((b) => b.status === 'Pending').length;
  const completedJobs = bookings.filter((b) => b.status === 'Completed').length;

  const totalEarnings = bookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);

  const recentBookings = bookings.slice(0, 5);

  return {
    provider: {
      id: provider._id,
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      address: provider.address,
      isAvailable: provider.isAvailable ?? true,
      bio: provider.bio || '',
      serviceArea: provider.serviceArea || '',
      avatar: provider.avatar || ''
    },
    stats: {
      totalBookings,
      pendingRequests,
      completedJobs,
      totalEarnings
    },
    servicesCount: services.length,
    recentBookings
  };
};

export const getProviderServices = async (providerId) => {
  return await Service.find({ $or: [{ providerId }, { providerId: null }] }).sort({ createdAt: -1 }).lean();
};

export const createProviderService = async (providerId, serviceData) => {
  const service = new Service({
    ...serviceData,
    providerId
  });
  const savedService = await service.save();
  return savedService.toObject();
};

export const updateProviderService = async (providerId, serviceId, updateData) => {
  const existingService = await Service.findOne({ _id: serviceId, $or: [{ providerId }, { providerId: null }] });
  if (!existingService) {
    throw new Error('Service not found or you do not have permission to modify it.');
  }

  const updated = await Service.findByIdAndUpdate(
    serviceId,
    { $set: { ...updateData, providerId } },
    { new: true, runValidators: true }
  ).lean();

  return updated;
};

export const deleteProviderService = async (providerId, serviceId) => {
  const existingService = await Service.findOne({ _id: serviceId, providerId });
  if (!existingService) {
    throw new Error('Service not found or you do not have permission to delete it.');
  }

  return await Service.findByIdAndDelete(serviceId).lean();
};

export const getProviderBookings = async (providerId, filters = {}) => {
  const { status, search, sort = 'newest' } = filters;

  const services = await Service.find({ $or: [{ providerId }, { providerId: null }] }).select('_id serviceName').lean();
  const serviceIds = services.map((s) => s._id);

  const query = { serviceId: { $in: serviceIds } };

  if (status && status !== 'All') {
    query.status = status;
  }

  let bookings = await Booking.find(query)
    .populate({ path: 'userId', select: 'name email phone address' })
    .populate({ path: 'serviceId', select: 'serviceName category price image' })
    .lean();

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    bookings = bookings.filter((b) => {
      const customerName = (b.userId?.name || '').toLowerCase();
      const serviceName = (b.serviceId?.serviceName || '').toLowerCase();
      const address = (b.address || '').toLowerCase();
      return customerName.includes(q) || serviceName.includes(q) || address.includes(q);
    });
  }

  if (sort === 'oldest') {
    bookings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'highest_price') {
    bookings.sort((a, b) => (b.serviceId?.price || 0) - (a.serviceId?.price || 0));
  } else {
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return bookings;
};

export const updateProviderBookingStatus = async (providerId, bookingId, status) => {
  const booking = await Booking.findById(bookingId).populate('serviceId');
  if (!booking) {
    throw new Error('Booking not found');
  }

  const service = await Service.findOne({ _id: booking.serviceId?._id || booking.serviceId });
  if (!service) {
    throw new Error('Associated service not found.');
  }

  if (service.providerId && service.providerId.toString() !== providerId.toString()) {
    throw new Error('You do not have permission to modify this booking.');
  }

  let nextStatus = status;

  // Provider clicking "Mark Service Completed" transitions status to "Payment Pending"
  if (status === 'Completed' || status === BOOKING_STATUS.COMPLETED) {
    nextStatus = BOOKING_STATUS.PAYMENT_PENDING;
  }

  booking.status = nextStatus;
  await booking.save();

  // Notifications
  const customerId = booking.userId?._id ? booking.userId._id : booking.userId;
  const serviceName = service.serviceName || 'Service';
  const price = service.price || 0;

  if (nextStatus === BOOKING_STATUS.PAYMENT_PENDING) {
    await createNotification({
      userId: customerId,
      title: 'Service Completed',
      message: `Service completed! Please pay ₹${price} to complete booking.`,
      type: 'PAYMENT',
      bookingId: booking._id
    });
  } else if (nextStatus === BOOKING_STATUS.ACCEPTED || nextStatus === 'Accepted') {
    await createNotification({
      userId: customerId,
      title: 'Booking Accepted',
      message: `Your booking for ${serviceName} has been accepted by the service provider.`,
      type: 'BOOKING',
      bookingId: booking._id
    });
  }

  return await Booking.findById(bookingId)
    .populate({ path: 'userId', select: 'name email phone address' })
    .populate({ path: 'serviceId', select: 'serviceName category price' })
    .lean();
};

export const getProviderEarnings = async (providerId) => {
  const services = await Service.find({ $or: [{ providerId }, { providerId: null }] }).select('_id').lean();
  const serviceIds = services.map((s) => s._id);

  const bookings = await Booking.find({ serviceId: { $in: serviceIds } })
    .sort({ createdAt: -1 })
    .populate({ path: 'userId', select: 'name email' })
    .populate({ path: 'serviceId', select: 'serviceName price' })
    .lean();

  const completedBookings = bookings.filter((b) => b.status === 'Completed' || b.paymentStatus === 'Paid');
  const pendingBookings = bookings.filter((b) => b.status === 'Pending' || b.status === 'Accepted' || b.status === 'Confirmed' || b.status === 'Payment Pending');

  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);
  const pendingPayments = pendingBookings.reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthEarnings = completedBookings
    .filter((b) => {
      const bDate = new Date(b.paidAt || b.updatedAt || b.createdAt);
      return bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear;
    })
    .reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);

  const history = bookings.map((b) => ({
    id: b._id,
    date: b.paidAt || b.bookingDate || b.createdAt,
    customer: b.userId?.name || 'Customer',
    service: b.serviceId?.serviceName || 'Service',
    amount: b.serviceId?.price || 0,
    status: b.status,
    paymentStatus: b.paymentStatus || (b.status === 'Completed' ? 'Paid' : 'Pending')
  }));

  return {
    totalEarnings,
    thisMonthEarnings,
    pendingPayments,
    completedJobs: completedBookings.length,
    history
  };
};

export const updateProviderProfile = async (providerId, updateData) => {
  const allowedFields = ['name', 'phone', 'address', 'bio', 'serviceArea', 'avatar', 'isAvailable'];
  const sanitizedUpdate = {};

  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      sanitizedUpdate[key] = updateData[key];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    providerId,
    { $set: sanitizedUpdate },
    { new: true, runValidators: true }
  ).select('-password').lean();

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};
