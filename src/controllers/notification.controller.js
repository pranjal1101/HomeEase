import * as notificationService from '../services/notification.service.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await notificationService.getUserNotifications(userId);
    return res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications.'
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updated = await notificationService.markNotificationAsRead(id, userId);
    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update notification.'
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    await notificationService.markAllNotificationsAsRead(userId);
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notifications as read.'
    });
  }
};
