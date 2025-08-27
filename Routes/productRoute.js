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
// https://renturn.vercel.app/api/v1/products
route.get("/", getAllProducts);
route.get("/:id", getSingleProduct);

// Product creation with single image upload
route.post("/", protect, uploadSingleImage, postProduct);

// Product creation with multiple images upload (alternative endpoint)
route.post("/multiple-images", protect, uploadMultipleImages, postProduct);

route.put("/:id", protect, UpdateProduct);

route.delete("/:id", protect, DeleteProduct);

module.exports = route;
