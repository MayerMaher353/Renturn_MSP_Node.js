const { date } = require("joi");
const mongoose = require("mongoose");

const ProductModel = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  product_description: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100,
  },
  quantity: {
    type: Number,
    min: 0,
  },
  price: {
    type: Number,
    min: 0,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: false,
  },
  start:{
    type:Date,
    required:true
  },
  end:{
    type:Date,
    required:true
  }
});

const product = mongoose.model("Product", ProductModel);

module.exports = product;
