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
route.get("/:id", getSingleProduct);// https://renturn.vercel.app/api/v1/products/:id

// Product creation with single image upload
route.post("/", protect, uploadSingleImage, postProduct);// https://renturn.vercel.app/api/v1/products


// Product creation with multiple images upload (alternative endpoint)
route.post("/multiple-images", protect, uploadMultipleImages, postProduct);// https://renturn.vercel.app/api/v1/products/multiple-images


route.put("/:id", protect, UpdateProduct);// https://renturn.vercel.app/api/v1/products/:id


route.delete("/:id", protect, DeleteProduct);// https://renturn.vercel.app/api/v1/products/:id


module.exports = route;
