const jwt = require("jsonwebtoken")
const User = require("../models/User")
const logger = require("../utils/logger")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    const user = await User.findById(decoded.userId).select("-password")

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Invalid token. User not found.",
      })
    }

    req.userId = user._id
    req.user = user
    next()
  } catch (error) {
    logger.error("Auth middleware error", { error: error.message })
    res.status(401).json({
      error: "Invalid token.",
    })
  }
}

module.exports = auth
