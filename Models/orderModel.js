const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  //this is the order summary
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      qty: { type: Number, default: 1 },
      price: { type: Number, required: true },
    },
  ],

  subtotal: { type: Number, required: true },
  diliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },

  // This is a form that the user should fill it
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },

  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },

  specialInstructions: { type: String },

  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "completed", "cancelled","Refunding","paid_pending_delivery"],
    default: "pending",
  },
  fundsStatus: {
  type: String,
  enum: ["none", "held", "released", "refunded"],
  default: "none",
},

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);