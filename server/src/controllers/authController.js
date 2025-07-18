const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const User = require("../models/User")
const logger = require("../utils/logger")

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })
}

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      })
    }

    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists with this email",
      })
    }

    // Create new user
    const user = new User({ name, email, password })
    await user.save()

    const token = generateToken(user._id)

    logger.info("User registered successfully", { userId: user._id, email })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    logger.error("Registration error", { error: error.message })
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      })
    }

    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email, isActive: true })
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      })
    }

    const token = generateToken(user._id)

    logger.info("User logged in successfully", { userId: user._id, email })

    res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    logger.error("Login error", { error: error.message })
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      })
    }

    res.json({
      user: user.toJSON(),
    })
  } catch (error) {
    logger.error("Get profile error", { error: error.message })
    next(error)
  }
}

module.exports = {
  register,
  login,
  getProfile,
}
