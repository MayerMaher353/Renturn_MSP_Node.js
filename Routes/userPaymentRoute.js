const express =require("express")
const route = express.Router()
const {getAvailableGateWay,chooseGateWay,createCheckout}= require("../Controllers/paymentMethodCotroller")

route.get("/availablePayment",getAvailableGateWay)
route.post("/chooseGateWay",chooseGateWay)
route.post("/checkout", createCheckout);

module.exports=route;