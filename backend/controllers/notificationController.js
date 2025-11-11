import Notification from '../models/Notification.js';
import NotificationService from '../services/notificationService.js';

// GET /api/notifications - Récupérer toutes les notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

// GET /api/notifications/unread/count - Nombre de notifications non lues
export const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ read: false });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
};

// PUT /api/notifications/:id/read - Marquer comme lu
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read'
    });
  }
};

// PUT /api/notifications/mark-all-read - Tout marquer comme lu
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read'
    });
  }
};

// DELETE /api/notifications/:id - Supprimer une notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
};

// POST /api/notifications/create - Créer une notification
export const createNotification = async (req, res) => {
  try {
    const { message, type, userId, relatedEntity, entityId } = req.body;

    const notification = new Notification({
      message,
      type: type || 'system',
      userId,
      relatedEntity,
      entityId
    });

    await notification.save();

    res.json({
      success: true,
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification'
    });
  }
};

// POST /api/notifications/simulate-new-user - Simuler nouvel utilisateur
export const simulateNewUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const notification = await NotificationService.createUserRegistrationNotification({
      _id: new mongoose.Types.ObjectId(),
      name: name || 'Test User',
      email: email || 'test@example.com'
    });

    res.json({
      success: true,
      message: 'Test notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error simulating new user:', error);
    res.status(500).json({
      success: false,
      message: 'Error simulating new user'
    });
  }
};