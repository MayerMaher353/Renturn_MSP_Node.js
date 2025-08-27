const express =require("express")
const route = express.Router()
const {getAvailableGateWay,chooseGateWay}= require("../Controllers/paymentMethodCotroller")

route.get("/availablePayment",getAvailableGateWay)
route.post("/chooseGateWay",chooseGateWay)

module.exports=route;