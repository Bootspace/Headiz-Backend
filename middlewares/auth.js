const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWTSECRETKEY

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if(!token){
    return res.status(401).json({
      msg: 'No token, access denied'
    });
  }

  // Verify Token 
  try {
    const decoded = jwt.verify(token, secretKey)
    // Set user id in req.user
    req.user = decoded.user;
    next();
    
  } catch (error) {
    req.status(401).json({
      msg: 'Token is not Valid'
    });
  }
};