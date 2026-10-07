import Notification from '../models/notification.model.js';

export const createNotification = async ({ userId, title, message, type = 'GENERAL', bookingId = null }) => {
  if (!userId) return null;
  const notification = new Notification({
    userId,
    title,
    message,
    type,
    bookingId
  });
  return await notification.save();
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();
};

export const markNotificationAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { isRead: true } },
    { new: true }
  ).lean();
};

export const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
  return { success: true };
};
