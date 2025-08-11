const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied: No token provided" });
  }

  try {
    const cleanToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;
    const decoded = jwt.verify(
      cleanToken,
      process.env.JWT_SECRET || "your-secret-key"
    ); // Fallback for development
    req.id = decoded.id; // Save userId in request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
