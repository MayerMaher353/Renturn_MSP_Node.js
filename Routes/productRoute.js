const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  UpdateProduct,
  DeleteProduct,
  postProduct,
} = require("../Controllers/productControllers");
const { protect} = require("../middlewares/authMiddleware");

const route = express.Router();
// https://renturn.vercel.app/api/v1/products
route.get("/", getAllProducts);
route.get("/:id", getSingleProduct);
route.post("/", protect, postProduct);//Notic
route.put("/:id", protect, UpdateProduct);//Notic
route.delete("/:id",protect, DeleteProduct);//Notic

module.exports = route;
