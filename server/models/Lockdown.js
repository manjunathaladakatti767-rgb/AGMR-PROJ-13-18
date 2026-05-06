const mongoose = require('mongoose');

const lockdownSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: false,
    required: true
  },
  activatedAt: {
    type: Date,
    default: null
  },
  deactivatedAt: {
    type: Date,
    default: null
  },
  reason: {
    type: String,
    default: ''
  },
  activatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  log: [{
    action: {
      type: String,
      enum: ['ACTIVATED', 'DEACTIVATED']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, { timestamps: true });

const Lockdown = mongoose.model('Lockdown', lockdownSchema);

module.exports = Lockdown;
