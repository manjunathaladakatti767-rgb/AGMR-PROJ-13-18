const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// @route   GET /api/admin/stats
// @desc    Get global system statistics
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScans = await History.countDocuments();
    const dangerousScans = await History.countDocuments({ status: 'DANGEROUS' });
    const safeScans = await History.countDocuments({ status: 'SAFE' });

    // Get top 5 most blocked domains
    const topBlocked = await History.aggregate([
      { $match: { status: 'DANGEROUS' } },
      { $group: { _id: '$url', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      totalScans,
      dangerousScans,
      safeScans,
      topBlocked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
