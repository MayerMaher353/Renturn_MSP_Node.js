const Order = require("../Models/orderModel")
const asynchandler = require("express-async-handler");

exports.getAllOrder = asynchandler(async (req, res) => {
    const orders = await Order.find()
    res.status(200).json({status:"success",data:orders,count:orders.length})
});
