const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  UpdateProduct,
  DeleteProduct,
  postProduct,
} = require("../Controllers/productControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("../middlewares/uploadMiddleware");

const route = express.Router();

route.get("/", getAllProducts);
route.get("/:id", getSingleProduct);

// Product creation with single image upload
route.post("/", protect, uploadSingleImage, postProduct);

// Product creation with multiple images upload (alternative endpoint)
route.post("/multiple-images", protect, uploadMultipleImages, postProduct);

route.put("/:id", protect, authorize("admin"), UpdateProduct);

route.delete("/:id", protect, authorize("admin"), DeleteProduct);

module.exports = route;
