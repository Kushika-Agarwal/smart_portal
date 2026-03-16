const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

const adminAuth = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {

    const decoded = jwt.verify(token, SECRET);

    req.admin = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = adminAuth;