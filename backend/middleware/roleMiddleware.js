// middleware/roleMiddleware.js
// checks if logged-in user's role matches what the route requires
// used AFTER authMiddleware, since it needs req.user to already exist

// usage example later: router.get('/pending', protect, authorize('admin'), controllerFn)
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied for your role' });
      }
      next();
    };
  };
  
  module.exports = authorize;