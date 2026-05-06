const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const protect = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// @route   GET /api/settings
// @desc    Get current settings for the logged-in user's org
router.get('/', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    let settings = await Settings.findOne({ orgId: 'default_org' });
    if (!settings) {
      settings = await Settings.create({ userId: req.user._id, orgId: 'default_org' });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/settings
// @desc    Update settings (with whitelist)
router.patch('/', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    const { urlScanning, notifications, riskThreshold, alertFrequency, scanMode } = req.body;
    
    // Validate risk threshold
    if (riskThreshold !== undefined) {
      if (!Number.isInteger(Number(riskThreshold)) || riskThreshold < 0 || riskThreshold > 100) {
        return res.status(400).json({ success: false, message: 'Risk threshold must be an integer between 0 and 100' });
      }
    }

    // Validate enum fields
    if (alertFrequency && !['Instant', 'Hourly', 'Daily'].includes(alertFrequency)) {
      return res.status(400).json({ success: false, message: 'Invalid alert frequency' });
    }
    if (scanMode && !['Passive', 'Active', 'Aggressive'].includes(scanMode)) {
      return res.status(400).json({ success: false, message: 'Invalid scan mode' });
    }

    // Build whitelist payload
    const updatePayload = {};
    if (urlScanning !== undefined) updatePayload.urlScanning = Boolean(urlScanning);
    if (notifications !== undefined) updatePayload.notifications = Boolean(notifications);
    if (riskThreshold !== undefined) updatePayload.riskThreshold = Number(riskThreshold);
    if (alertFrequency !== undefined) updatePayload.alertFrequency = alertFrequency;
    if (scanMode !== undefined) updatePayload.scanMode = scanMode;

    const settings = await Settings.findOneAndUpdate(
      { orgId: 'default_org' },
      { $set: updatePayload },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
