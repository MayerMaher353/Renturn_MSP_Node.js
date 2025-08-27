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
    required: false,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const product = mongoose.model("Product", ProductModel);

module.exports = product;
