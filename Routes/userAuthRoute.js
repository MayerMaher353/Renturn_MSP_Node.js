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
const { protect } = require("../middlewares/authMiddleware");

// Public routes (no protection required)
router.post("/register", registerUser);//http://localhost:5000/api/v1/auth/register
router.post("/login", loginUser);//http://localhost:5000/api/v1/auth/login
router.post("/forgotpassword", forgotPassword);//http://localhost:5000/api/v1/auth/forgotpassword
router.post("/resetpassword", resetPassword);//http://localhost:5000/api/v1/auth/resetpassword

// Protected routes (require authentication)
router.get("/me", protect, getMe);//http://localhost:5000/api/v1/auth/me
router.put("/updateprofile", protect, updateProfile);//http://localhost:5000/api/v1/auth/updateprofile
router.put("/changepassword", protect, changePassword);//http://localhost:5000/api/v1/auth/changepassword
router.post("/logout", protect, logoutUser);//http://localhost:5000/api/v1/auth/logout

module.exports = router;
