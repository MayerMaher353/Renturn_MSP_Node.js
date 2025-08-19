const express = require("express");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes (no authentication required)
router.route("/").get(getCategories);

// Protected routes (require authentication and admin role)
router.route("/").post(protect, authorize("admin"), createCategory);
router
  .route("/:id")
  .get(getCategory) // Public access to view specific category
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
