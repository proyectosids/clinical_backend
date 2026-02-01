const jwt = require('jsonwebtoken');
const config = require('../config/app');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

function authorizeRoles(...roles) { 
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.id_rol)) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles };
