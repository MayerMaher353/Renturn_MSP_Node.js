const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../Controllers/authController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

// Admin only routes
router.get("/users", getAllUsers); //https://renturn.vercel.app/api/v1/admin/users
router.get("/users/:id", getUserById);  //https://renturn.vercel.app/api/v1/admin/users/:id
router.delete("/users/:id", deleteUser);//https://renturn.vercel.app/api/v1/admin/users/:id

module.exports = router;
