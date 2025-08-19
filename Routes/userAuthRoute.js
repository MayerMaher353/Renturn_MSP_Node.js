const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  logoutUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../Controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (no protection required)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

// Protected routes (require authentication)
router.get("/me", protect, getMe);
router.put("/updateprofile", protect, updateProfile);
router.put("/changepassword", protect, changePassword);
router.post("/logout", protect, logoutUser);

module.exports = router;
