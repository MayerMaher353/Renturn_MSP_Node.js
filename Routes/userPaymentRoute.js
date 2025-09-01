const express =require("express")
const route = express.Router()
const {getAvailableGateWay,chooseGateWay,createCheckout}= require("../Controllers/paymentMethodCotroller")
const { protect } = require("../middlewares/authMiddleware");


route.get("/availablePayment",protect,getAvailableGateWay)
route.post("/chooseGateWay",protect,chooseGateWay)
route.post("/checkout", protect,createCheckout);

module.exports=route;