const express = require("express")
const { body } = require("express-validator")
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController")
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

// Validation rules
const updateUserValidation = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
]

// Routes
router.get("/", auth, getAllUsers)
router.get("/:id", auth, getUserById)
router.put("/:id", auth, updateUserValidation, updateUser)
router.delete("/:id", auth, adminAuth, deleteUser)

module.exports = router
