const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lockdown = require('../models/Lockdown');

// In-memory cache for lockdown state (10s TTL)
let lockdownCache = { data: null, expiresAt: 0 };

const getLockdownState = async () => {
  if (Date.now() < lockdownCache.expiresAt) {
    return lockdownCache.data;
  }
  const lockdown = await Lockdown.findOne().sort({ createdAt: -1 });
  lockdownCache = {
    data: lockdown,
    expiresAt: Date.now() + 10000 // 10 seconds
  };
  return lockdown;
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      req.user = user;

      // Check lockdown state
      const lockdown = await getLockdownState();
      
      if (lockdown && lockdown.active) {
        // Exempt superadmin from lockdown restrictions
        if (req.user.role !== 'superadmin') {
          // 1. Force-expire sessions if token was issued before lockdown
          const iatDate = new Date(decoded.iat * 1000);
          if (iatDate < lockdown.activatedAt) {
            return res.status(401).json({ success: false, message: 'Session expired due to system lockdown' });
          }

          // 2. Return 503 for non-admin routes during lockdown
          if (!req.originalUrl.startsWith('/api/admin') && !req.originalUrl.startsWith('/api/lockdown')) {
            return res.status(503).json({ success: false, message: 'System is under lockdown' });
          }
        }
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = protect;
