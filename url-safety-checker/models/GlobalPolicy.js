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
  }
}, { timestamps: true });

module.exports = mongoose.model('GlobalPolicy', globalPolicySchema);
