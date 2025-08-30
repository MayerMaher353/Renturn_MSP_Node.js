const Order = require("../Models/orederModel");
const Cart = require("../Models/cartModel");
const asyncHandler = require("express-async-handler");

exports.createCheckout = asyncHandler(async (req, res) => {
  //get the items in cart to make order
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );
  //check if the cart is impty or not
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ status: "Faild", message: "Cart" });
  }
  //claculate  the subtotal(price of product * quantity) + dilivery fee +tax
  const subtotal = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
  const diliveryFee = 25;
  const tax = 0.12 * subtotal; //12%
  const total = subtotal + diliveryFee + tax;
  // create order schema
  const createOrder = await Order.create({
    user: req.user.id,
    items: cart.items.map((i) => ({
      product:i.product._id,
      quantity:i.quantity,
    })),
    total,
    firstName:req.body,
    lastName:req.body,
    email:req.body,
    phoneNumber:req.body,
    streetAddress:req.body,
    city:req.body,
    state:req.body,
    specialInstructions:req.body
  });

  //delete the items from carts after order
  await Cart.findByIdAndDelete({user:req.user.id})
  res.status(200).json({status:"Success",createOrder})
});



