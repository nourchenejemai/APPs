import Notification from '../models/Notification.js';

class NotificationService {
  // Créer une notification pour un nouvel utilisateur
  static async createUserRegistrationNotification(userData) {
    try {
      const notification = new Notification({
        message: `Nouvel utilisateur inscrit: ${userData.name} (${userData.email})`,
        type: 'user',
        userId: userData._id,
        relatedEntity: 'user',
        entityId: userData._id
      });

      await notification.save();
      console.log('Notification utilisateur créée:', notification.message);
      return notification;
    } catch (error) {
      console.error('Erreur création notification utilisateur:', error);
      throw error;
    }
  }

  // Créer une notification pour capteur
  static async createSensorNotification(sensorName, value, unit = '') {
    try {
      const notification = new Notification({
        message: `Alerte capteur: ${sensorName} - Valeur: ${value}${unit}`,
        type: 'sensor',
        relatedEntity: 'sensor'
      });

      await notification.save();
      console.log('Notification capteur créée:', notification.message);
      return notification;
    } catch (error) {
      console.error('Erreur création notification capteur:', error);
      throw error;
    }
  }

  // Créer une notification système
  static async createSystemNotification(message, relatedEntity = null, entityId = null) {
    try {
      const notification = new Notification({
        message,
        type: 'system',
        relatedEntity,
        entityId
      });

      await notification.save();
      console.log('Notification système créée:', message);
      return notification;
    } catch (error) {
      console.error('Erreur création notification système:', error);
      throw error;
    }
  }

  // Créer une notification d'alerte
  static async createAlertNotification(message, entityId = null) {
    try {
      const notification = new Notification({
        message,
        type: 'alert',
        relatedEntity: 'alert',
        entityId
      });

      await notification.save();
      console.log('Notification alerte créée:', message);
      return notification;
    } catch (error) {
      console.error('Erreur création notification alerte:', error);
      throw error;
    }
  }
}

export default NotificationService;