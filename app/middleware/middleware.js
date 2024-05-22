// LIBRARY IMPORT
const jwt = require('jsonwebtoken');

// CONSTANT IMPORT
const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing access token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.exp < Date.now() / 1000) {
      return res.status(500).json({ message: 'Unauthorized: Access token expired' });
    }
    req.locals = { user: decoded.userID };

    return next();
    
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid access token' });
  }
};

module.exports = { authenticateToken };
