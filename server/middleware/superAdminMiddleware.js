const User = require('../models/User');

const superAdminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user && user.role === 'superadmin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Super Admins only' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

module.exports = superAdminOnly;
