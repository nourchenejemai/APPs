import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  simulateNewUser
} from '../controllers/notificationController.js';

const Notification = express.Router();

Notification.get('/getnotification', getNotifications);
Notification.get('/unread/count', getUnreadCount);
Notification.put('/:id/read', markAsRead);
Notification.put('/mark-all-read', markAllAsRead);
Notification.delete('/:id', deleteNotification);
Notification.post('/create', createNotification);
Notification.post('/simulate-new-user', simulateNewUser);

export default Notification;