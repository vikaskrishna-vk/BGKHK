const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Built-in users
const builtInUsers = [
  {
    name: "Faculty Mentor",
    email: "mentor@internai.com",
    role: "mentor",
  },
  {
    name: "Admin",
    email: "admin@internai.com",
    role: "admin",
  },
];

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Check built-in users first
    const builtIn = builtInUsers.find((u) => u.email === decoded.id);

    if (builtIn) {
      req.user = builtIn;
      return next();
    }

    // 🔹 Normal database user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account deactivated",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};

// ─── ROLE AUTHORIZATION ─────────────
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized`,
      });
    }

    next();
  };

// ─── OPTIONAL AUTH ──────────────────
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const builtIn = builtInUsers.find((u) => u.email === decoded.id);

      if (builtIn) {
        req.user = builtIn;
      } else {
        req.user = await User.findById(decoded.id).select("-password");
      }
    }
  } catch {}

  next();
};

module.exports = { protect, authorize, optionalAuth };
