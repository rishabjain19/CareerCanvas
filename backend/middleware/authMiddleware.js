const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  // expects header format: "Bearer <token>"
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach userId to the request so controllers know who's making the request
      req.userId = decoded.userId;

      next(); // token is valid, let the request continue to the controller
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = protect;
