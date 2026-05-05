/**
 * URL Report Model
 * Defines the schema for storing URL safety check results in MongoDB.
 */
const mongoose = require('mongoose');

const urlReportSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true, // Unique index to prevent duplicate entries
    index: true
  },
  status: {
    type: String,
    enum: ["SAFE", "SUSPICIOUS", "DANGEROUS"],
    required: true
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  reasons: {
    type: [String],
    default: []
  },
  recommendation: {
    type: String,
    default: ""
  },
  checkedBy: {
    type: [String],
    required: true // e.g. ["GoogleSafeBrowsing", "VirusTotal", "CustomScorer"]
  }
}, { 
  timestamps: true // Auto timestamp for createdAt and updatedAt
});

const UrlReport = mongoose.model('UrlReport', urlReportSchema);

module.exports = UrlReport;
