import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['user', 'system', 'alert', 'sensor'],
    default: 'system',
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false
  },
  relatedEntity: {
    type: String,
    required: false
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  }
}, { 
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);