const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../Controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

// Admin only routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

module.exports = router;
