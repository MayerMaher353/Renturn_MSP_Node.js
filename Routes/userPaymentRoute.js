const express =require("express")
const route = express.Router()
const {getAvailableGateWay,chooseGateWay,createCheckout}= require("../Controllers/paymentMethodCotroller")
const { protect } = require("../middlewares/authMiddleware");


route.get("/availablePayment",protect,getAvailableGateWay) //http://localhost:5000/api/v1/userPayment/availablePayment
route.post("/chooseGateWay",protect,chooseGateWay)//http://localhost:5000/api/v1/userPayment/chooseGateWay
route.post("/checkout", protect,createCheckout);//http://localhost:5000/api/v1/userPayment/checkout

module.exports=route;