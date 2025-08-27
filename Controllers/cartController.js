const Cart = require("../Models/cartModel");
const asynchandler = require("express-async-handler");
const Product = require("../Models/productModel");

/**
 getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartItemCount
 */
exports.getCart = asynchandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "item.productID"
  );
  if (!cart) {
    return res
      .status(200)
      .json({ status: "success ", data: { item: [], totalPrice: 0 } });
  }
  const totalPrice = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
  res.status(200).json({
    status: "success",
    data: { items: cart.items, totalPrice },
  });
});

exports.addToCart = asynchandler(async (req, res) => {
  // user request body
  const { productID, quantity } = req.body;
  const product = await Product.findById(productID);
  //check if the product available in product database

  if (!product) {
    return res
      .status(404)
      .json({ status: "failed", message: "product not found" });
  }

  let cart = await Cart.findOne({ user: req.user.id });
  //check if the user has cart if not we will create new cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      item: [{ Product: productID, quantity: quantity || 1 }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (el) => el.product.toString() === productID
    );
    const qty = quantity && quantity > 0 ? quantity : 1;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productID, quantity: qty });
    }
    await cart.save();
  }
  await cart.populate("item.product");
  const totalPrice = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  res.status(200).json({
    status: "success",
    data: { item: cart.items, totalPrice },
  });
});

exports.updateCartItem = asynchandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ status: "faild", message: "Qunaitity must be greater than 0" });
  }
  if (!productId) {
    return res
      .status(404)
      .json({ status: "faild", message: "The product not found" });
  }
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "item.product"
  );

  if (!cart) {
    return res
      .status(404)
      .json({ status: "failed", message: "cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (el) => el.product._id.toString() === productId
  );
  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ status: "faild", message: "Product not found in cart" });
  }
  cart.item[itemIndex].quantity = quantity;

  await cart.save();

  await cart.populate("item.product");

  const totalPrice = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  res.status(200).json({
    status: "success",
    data: { item: cart.items, totalPrice },
  });
});

exports.removeFromCart = asynchandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({
      status: "failed",
      message: "Product ID is required",
    });
  }
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res
      .status(404)
      .json({ status: "failed", message: "Cart not found" });
  }
  const itemIndex = cart.items.findIndex(
    (el) => el.product.toString() === productId
  );
  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ status: "Faild", message: "Product not found" });
  }
  cart.items.splice(itemIndex, 1);
  await cart.save();
  await cart.populate("item.product");
  const totalPrice = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  res.status(200).json({
    status: "success",
    message: "Product removed from cart",
    data: { items: cart.items, totalPrice },
  });
});

exports.getCartItemCount = asynchandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(200).json({ status: "success", count: 0 });
  }

  const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  res.status(200).json({ status: "Success", count: totalCount });
});
