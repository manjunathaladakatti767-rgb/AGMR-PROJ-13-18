const mongoose = require('mongoose');

const globalPolicySchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'default_policy'
  },
  blacklist: [String],
  whitelist: [String],
  sensitivityThreshold: {
    type: Number,
    default: 75
  },
  activeRules: {
    noHttps: { type: Boolean, default: true },
    suspiciousTld: { type: Boolean, default: true },
    googleSafeBrowsing: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('GlobalPolicy', globalPolicySchema);
