const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');
const GlobalPolicy = require('../models/GlobalPolicy');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const superAdminOnly = require('../middleware/superAdminMiddleware');

// @route   GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScans = await History.countDocuments();
    const dangerousScans = await History.countDocuments({ status: 'DANGEROUS' });
    const safeScans = await History.countDocuments({ status: 'SAFE' });
    const topBlocked = await History.aggregate([
      { $match: { status: 'DANGEROUS' } },
      { $group: { _id: '$url', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json({ totalUsers, totalScans, dangerousScans, safeScans, topBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users
router.get('/users', protect, superAdminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/role
router.put('/users/role', protect, superAdminOnly, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/policy
router.get('/policy', protect, adminOnly, async (req, res) => {
  try {
    let policy = await GlobalPolicy.findOne({ name: 'default_policy' });
    if (!policy) policy = await GlobalPolicy.create({ name: 'default_policy' });
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/policy/blacklist
router.post('/policy/blacklist', protect, adminOnly, async (req, res) => {
  try {
    const { url } = req.body;
    const policy = await GlobalPolicy.findOneAndUpdate(
      { name: 'default_policy' },
      { $addToSet: { blacklist: url } },
      { new: true, upsert: true }
    );
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/policy/blacklist
router.delete('/policy/blacklist', protect, adminOnly, async (req, res) => {
  try {
    const { url } = req.body;
    const policy = await GlobalPolicy.findOneAndUpdate(
      { name: 'default_policy' },
      { $pull: { blacklist: url } },
      { new: true }
    );
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/policy/sensitivity
router.put('/policy/sensitivity', protect, adminOnly, async (req, res) => {
  try {
    const { threshold } = req.body;
    const policy = await GlobalPolicy.findOneAndUpdate(
      { name: 'default_policy' },
      { sensitivityThreshold: threshold },
      { new: true }
    );
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/history
router.get('/history', protect, adminOnly, async (req, res) => {
  try {
    const history = await History.find({}).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
