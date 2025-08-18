const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  UpdateProduct,
  DeleteProduct,
  postProduct,
} = require("../Controllers/productControllers");
const route =express.Router();


route.get("/",getAllProducts)
route.get('/:id',getSingleProduct)
route.post('/',postProduct)
route.put('/:id',UpdateProduct)
route.delete('/:id',DeleteProduct)

module.exports = route;

