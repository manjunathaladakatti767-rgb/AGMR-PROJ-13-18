const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orgId: {
    type: String,
    default: 'default_org'
  },
  urlScanning: {
    type: Boolean,
    default: true
  },
  notifications: {
    type: Boolean,
    default: true
  },
  riskThreshold: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  alertFrequency: {
    type: String,
    enum: ['Instant', 'Hourly', 'Daily'],
    default: 'Instant'
  },
  scanMode: {
    type: String,
    enum: ['Passive', 'Active', 'Aggressive'],
    default: 'Active'
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
