// middleware/authMiddleware.js
// checks if request has a valid JWT — if yes, attaches user info to req.user

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // frontend sends token like: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer xyz" -> "xyz"

  try {
    // verify checks token is valid AND not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // e.g. { id: '...', role: 'worker' }
    next(); // token is good, move to actual route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;