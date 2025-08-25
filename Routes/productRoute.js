const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  UpdateProduct,
  DeleteProduct,
  postProduct,
} = require("../Controllers/productControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

const route = express.Router();
// https://renturn.vercel.app/api/v1/products
route.get("/", getAllProducts);
route.get("/:id", getSingleProduct);
route.post("/", protect, authorize("admin"), postProduct);
route.put("/:id", protect, authorize("admin"), UpdateProduct);
route.delete("/:id", protect, authorize("admin"), DeleteProduct);

module.exports = route;
