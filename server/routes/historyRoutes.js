const express = require('express');
const History = require('../models/History');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token' });
  }
};

// @route   POST /api/history
// @desc    Save a URL check to history
router.post('/', protect, async (req, res) => {
  const { url, status, riskScore, reasons, recommendation } = req.body;
  try {
    const history = await History.create({
      user: req.userId,
      url,
      status,
      riskScore,
      reasons,
      recommendation
    });
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/history
// @desc    Get user's URL check history
router.get('/', protect, async (req, res) => {
  try {
    const history = await History.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/history/:id
// @desc    Delete a history record
router.delete('/:id', protect, async (req, res) => {
  try {
    const history = await History.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });

    if (!history) {
      return res.status(404).json({ message: 'Record not found or not authorized' });
    }

    res.json({ message: 'Record removed successfully' });
  } catch (error) {
    console.error('Delete History Error:', error);
    res.status(500).json({ message: 'Error removing record' });
  }
});

module.exports = router;
