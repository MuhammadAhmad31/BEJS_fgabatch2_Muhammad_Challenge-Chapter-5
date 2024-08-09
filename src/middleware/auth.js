const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token.replace("Bearer ", ""));
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticate;
