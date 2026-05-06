const express = require('express');
const router = express.Router();
const Lockdown = require('../models/Lockdown');
const protect = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// @route   GET /api/lockdown/status
// @desc    Public route to get global lockdown status
router.get('/status', async (req, res) => {
  try {
    let lockdown = await Lockdown.findOne().sort({ createdAt: -1 });
    if (!lockdown) {
      lockdown = await Lockdown.create({ active: false });
    }
    res.json({
      success: true,
      data: {
        active: lockdown.active,
        activatedAt: lockdown.activatedAt,
        reason: lockdown.reason,
        activatedBy: lockdown.activatedBy
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/lockdown/activate
// @desc    Super Admin only: Activate global lockdown
router.post('/activate', protect, requireRole('superadmin'), async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason is required for lockdown' });
    }

    const lockdown = await Lockdown.findOne().sort({ createdAt: -1 });
    
    // We update the existing record or create if not exists
    if (!lockdown) {
      await Lockdown.create({
        active: true,
        activatedAt: new Date(),
        reason,
        activatedBy: req.user._id,
        log: [{ action: 'ACTIVATED', reason, performedBy: req.user._id }]
      });
    } else {
      lockdown.active = true;
      lockdown.activatedAt = new Date();
      lockdown.reason = reason;
      lockdown.activatedBy = req.user._id;
      lockdown.log.push({ action: 'ACTIVATED', reason, performedBy: req.user._id });
      await lockdown.save();
    }

    res.json({ success: true, data: { active: true, activatedAt: new Date(), reason } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/lockdown/deactivate
// @desc    Super Admin only: Deactivate global lockdown
router.post('/deactivate', protect, requireRole('superadmin'), async (req, res) => {
  try {
    const lockdown = await Lockdown.findOne().sort({ createdAt: -1 });
    
    if (lockdown && lockdown.active) {
      lockdown.active = false;
      lockdown.deactivatedAt = new Date();
      lockdown.reason = '';
      lockdown.log.push({ action: 'DEACTIVATED', reason: 'Normal operations resumed', performedBy: req.user._id });
      await lockdown.save();
    }

    res.json({ success: true, data: { active: false } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
