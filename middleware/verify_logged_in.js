const jwt = require("jsonwebtoken");
const User = require('./../models/userModel');

async function verify_logged_in  (req, res, next)  {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ 
        status: 'Fail', 
        message: 'You are not logged in! Please log in to continue.' 
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'Fail',
        message: 'The user belonging to this token no longer exists.'
      })
    }
    next();
  } catch (err) {
    res.status(401).json({
      status: 'Fail',
      message: err.message
    });
  }
};

module.exports = verify_logged_in;