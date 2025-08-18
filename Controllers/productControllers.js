const Product = require("../Models/productModel");
const validationPostProduct = require("../validation/postProductValidation");
const asynchandler = require("express-async-handler");

// Get all products controller
exports.getAllProducts = asynchandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});
// Get speccific product by id controller
exports.getSingleProduct = asynchandler(async (req, res) => {
  const productID = req.params.id;
  const foundproduct = await Product.findById(productID);
  if (!foundproduct) {
    return res.status(404).json("no available product");
  }
  res.status(200).json(foundproduct);
});



//Post Product or add product
exports.postProduct = asynchandler(async (req, res) => {


  const { error } = validationPostProduct(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { product_name, product_description, quantity, price, categoryId  } =
    req.body;


  const exists = await Product.findOne({ product_name, CategoryID });
  if (exists) {
    return res
      .status(400)
      .json({ error: "Product already exists in this category" });
  }


  const newProduct = new Product({
    product_name,
    product_description,
    quantity,
    price,
    categoryId,
  });
  const saveProduct = await newProduct.save();


  res.status(201).json({status:"success",data:saveProduct});
});

//Update specific product
exports.UpdateProduct = asynchandler(async (req, res) => {
  const updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );


  if (!updateProduct) {
    return res.status(400).json({ error: "product not found" });
  }


  res.status(202).json({
    status: "success",
    data: updateProduct,
  });
});



//Delete sprcific product
exports.DeleteProduct = asynchandler(async (req, res) => {
  const deleteproduct = await Product.findByIdAndDelete(req.params.id);

  if (!deleteproduct) {
    return res
      .status(404)
      .json({ status: "fail", message: "product not found" });
  }
  
  res.status(200).json({ status: "Success", data: null });
});

