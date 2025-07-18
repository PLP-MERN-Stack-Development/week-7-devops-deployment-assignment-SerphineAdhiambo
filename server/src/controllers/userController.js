const { validationResult } = require("express-validator")
const User = require("../models/User")
const logger = require("../utils/logger")

const getAllUsers = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find({ isActive: true })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments({ isActive: true })

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error("Get users error", { error: error.message })
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user || !user.isActive) {
      return res.status(404).json({
        error: "User not found",
      })
    }

    res.json({ user })
  } catch (error) {
    logger.error("Get user error", { error: error.message })
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      })
    }

    const { name, email } = req.body
    const userId = req.params.id

    // Check if user exists
    const user = await User.findById(userId)
    if (!user || !user.isActive) {
      return res.status(404).json({
        error: "User not found",
      })
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } })
      if (existingUser) {
        return res.status(409).json({
          error: "Email already taken",
        })
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    ).select("-password")

    logger.info("User updated successfully", { userId, updatedBy: req.userId })

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    logger.error("Update user error", { error: error.message })
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    const user = await User.findById(userId)
    if (!user || !user.isActive) {
      return res.status(404).json({
        error: "User not found",
      })
    }

    // Soft delete - set isActive to false
    await User.findByIdAndUpdate(userId, { isActive: false })

    logger.info("User deleted successfully", { userId, deletedBy: req.userId })

    res.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    logger.error("Delete user error", { error: error.message })
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}
