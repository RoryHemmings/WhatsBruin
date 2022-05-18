const jwt = require('jsonwebtoken');

/* Authentication Middleware */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) { return res.sendStatus(401); }   // No Authorization

  // Make sure that authorization token is valid
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) { return res.sendStatus(403); }  // Authorization invalid

    // If so, set user
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken
}