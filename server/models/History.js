const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  riskScore: {
    type: Number,
    required: true
  },
  reasons: {
    type: [String],
    default: []
  },
  recommendation: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const History = mongoose.model('History', historySchema);

module.exports = History;
