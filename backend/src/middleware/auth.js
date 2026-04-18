const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non autorise' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.schoolId = decoded.schoolId;
    req.role = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = { protect };
