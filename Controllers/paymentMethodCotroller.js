const {
  getAuthToken,
  registerOrder,
  generatePaymentKey,
  getIframeUrl,
} = require("../services/paymobService");
const {
  paymentModel,
  payMobModel,
  fawryModel,
} = require("../Models/paymentModel");
const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");
const PaymentTransaction = require("../Models/paymentTransactionModel");
const asynchandler = require("express-async-handler");
const crypto = require("crypto");
const { encrypt, decrypt } = require("../utils/crypto");

function hashValue(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// Add payment method by admin
exports.addGateWay = asynchandler(async (req, res) => {
  const { type, name, ...rest } = req.body;
  let config;
  if (type === "paymob") {
    const exists = await payMobModel.findOne({
      apiKeyHash: hashValue(rest.apiKey),
    });
    if (exists) {
      return res
        .status(400)
        .json({ status: "failed", message: "This apiKey already exits" });
    }
    config = await payMobModel.create({
      ...rest,
      apiKey: encrypt(rest.apiKey),
      apiKeyHash: hashValue(rest.apiKey),
      hMacSecret: encrypt(rest.hMacSecret),
      integrationId: rest.integrationId,
      iframeId: rest.iframeId,
    });
  } else if (type === "fawry") {
    const exists = await fawryModel.findOne({
      secureKeyHash: hashValue(rest.secureKey),
    });
    if (exists) {
      return res
        .status(400)
        .json({ status: "faild", message: "This secureKey already exists" });
    }
    config = await fawryModel.create({
      ...rest,
      secureKey: encrypt(rest.secureKey),
      secureKeyHash: hashValue(rest.secureKey),
    });
  } else {
    return res
      .status(400)
      .json({ status: "failed", message: "Unsupported provider type" });
  }
  const gateway = await paymentModel.create({ name, type, config: config._id });
  res.status(200).json({ status: "success", gateway });
});

//get the payment methods that you have in the server(Admin)
exports.getGatWay = asynchandler(async (req, res) => {
  const gateways = await paymentModel.find().populate("config");

  const decrypted = gateways.map((gw) => {
    const creds = gw.config.toObject();
    if (gw.type === "paymob") {
      let apiKeyEnc = creds.apiKey;
      if (typeof apiKeyEnc === "string") {
        try {
          apiKeyEnc = JSON.parse(apiKeyEnc);
        } catch (e) {}
      }
      let hmacEnc = creds.hMacSecret;
      if (typeof hmacEnc === "string") {
        try {
          hmacEnc = JSON.parse(hmacEnc);
        } catch (e) {}
      }

      creds.apiKey = decrypt(apiKeyEnc);
      creds.hMacSecret = decrypt(hmacEnc);
    }
    if (gw.type === "fawry") {
      let secKeyEnc = creds.securityKey;
      if (typeof secKeyEnc === "string") {
        try {
          secKeyEnc = JSON.parse(secKeyEnc);
        } catch (e) {}
      }

      creds.securityKey = decrypt(secKeyEnc);
    }
    return { ...gw.toObject(), config: creds };
  });

  res.json({ status: "Success", gateways: decrypted });
});

//udpate date on specific gateway such as apikey in paymob payment method(Admin)
exports.updateGateWay = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { cred } = req.body;
  const gateway = await paymentModel.findByIdAndUpdate(
    id,
    { ...cred },
    { new: true, runValidators: true }
  );

  if (!gateway) {
    return res
      .status(404)
      .json({ status: "Faild", message: "Gatway not found" });
  }

  res.status(200).json({ status: "Success", gateway });
});

//delete specific gateway payment(Admin)
exports.deleteGateWay = asynchandler(async (req, res) => {
  const { id } = req.params;
  const gateway = await paymentModel.findByIdAndDelete(id);
  if (!gateway) {
    return res
      .status(404)
      .json({ status: "Faild", message: "Gateway not found" });
  }
  res
    .status(200)
    .json({ status: "Success", message: "Gateway deleted successfully" });
});

//get
//User can see the available gate ways
exports.getAvailableGateWay = asynchandler(async (req, res) => {
  const availableGateWay = await paymentModel.find().select("type name");
  res.status(200).json({ status: "Success", availableGateWay });
});

//get method that allow user choose the way of payment fawry or paymob
exports.chooseGateWay = asynchandler(async (req, res) => {
  const { orderId, gateway } = req.body;
  const gw = await paymentModel.findById(gateway);
  if (!gw) {
    return res
      .status(404)
      .json({ status: "Faild", message: "Gateway not found" });
  }
  const order = await Order.findById(orderId);
  if (!order) {
    return res
      .status(404)
      .json({ status: "Faild", message: "Order not found" });
  }
  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      status: "faild",
      message: "not authorized to access this order",
    });
  }
  if (gw.type === "paymob") {
    let apiKeyEnc = gw.config.apiKey;
    if (typeof apiKeyEnc === "string") {
      try {
        apiKeyEnc = JSON.parse(apiKeyEnc);
      } catch (e) {}
    }

    const authToken = await getAuthToken(apiKeyEnc);

    const orderPopulated = await Order.findById(order._id).populate(
      "items.product"
    );
    const itemsForPaymob = orderPopulated.items.map((i) => ({
      name: i.product.product_name,
      amount_cents: Math.round(i.product.price * 100),
      quantity: i.quantity,
    }));
    const amountCents = Math.round(order.total * 100);
    const paymobOrder = await registerOrder(
      authToken,
      order._id.toString(),
      amountCents,
      itemsForPaymob
    );
    const paymobOrderId = paymobOrder.id;

    const billingData = {
      apartment: "NA",
      email: order.email || "customer@test.com",
      floor: "NA",
      first_name: order.firstName || "Test",
      last_name: order.lastName || "User",
      phone_number: order.phoneNumber || "+201234567890",
      street: order.streetAddress || "NA",
      building: "NA",
      shipping_method: "NA",
      postal_code: "NA",
      city: order.city || "Cairo",
      country: "EG",
      state: order.state || "NA",
    };
    const paymentKey = await generatePaymentKey(
      authToken,
      paymobOrderId,
      amountCents,
      billingData,
      Number(gw.config.integrationId)
    );
    const iframeUrl = getIframeUrl(gw.config.iFrame, paymentKey);

    await PaymentTransaction.create({
      orderId: order._id,
      paymentMethod: "paymob",
      amount: order.total,
      status: "pending",
      gateWayTransactionId: paymobOrderId,
    });

    return res.status(200).json({
      status: "Success",
      message: `You have selected ${gw.type} as your payment method`,
      iframeUrl,
    });
  } else if (gw.type === "fawry") {
    return res.status(200).json({
      status: "Success",
      message: `you have selected ${gw.type} as your payment method`,
    });
  }
  res.status(400).json({ status: "fail", message: "Unsupported gateway" });
});

//Create checkout form to make an order
exports.createCheckout = asynchandler(async (req, res) => {
  //get the items in cart to make order
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );
  //check if the cart is impty or not
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ status: "Faild", message: "Cart not found" });
  }
  //claculate  the subtotal(price of product * quantity) + dilivery fee +tax
  const subtotal = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
  const diliveryFee = 25;
  const tax = 0.12 * subtotal; //12%
  const total = subtotal + diliveryFee + tax;
  const amountCents = Math.round(total * 100);
  // create order schema
  const createOrder = await Order.create({
    user: req.user.id,
    items: cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
    })),
    subtotal,
    diliveryFee,
    tax,
    total,
    status: "pending",
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    state: req.body.state,
    specialInstructions: req.body.specialInstructions,
  });

  //delete the items from carts after order
  await Cart.findOneAndDelete({ user: req.user.id });
  res.status(200).json({
    status: "Success",
    message: "Order created. Please choose a payment gateway.",
    createOrder,
  });
});
