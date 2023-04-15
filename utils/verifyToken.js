const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    const tokenVal = token.split(' ')[1];
    jwt.verify(tokenVal, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json('Invalid token');
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json('Not authenticated');
  }
}

const verifyTokenAndAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json('Request forbidden');
    }
  });
}

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json('Request forbidden Not Admin');
    }
  });
}

module.exports = { 
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin
};
