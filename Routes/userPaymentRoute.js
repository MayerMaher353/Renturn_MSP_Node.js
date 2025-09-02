const express =require("express")
const route = express.Router()
const {getAvailableGateWay,chooseGateWay,createCheckout}= require("../Controllers/paymentMethodCotroller")
const { protect } = require("../middlewares/authMiddleware");


<<<<<<< HEAD
route.get("/availablePayment",protect,getAvailableGateWay) //https://renturn.vercel.app/userPayment/availablePayment or http://localhost:5000/api/v1/userPayment/availablePayment
route.post("/choose-gateway",protect,chooseGateWay);//https://renturn.vercel.app/userPayment/chooseGateWay or http://localhost:5000/api/v1/userPayment/choose-gateway
route.post("/checkout", protect,createCheckout);//https://renturn.vercel.app/userPayment/checkout or http://localhost:5000/api/v1/userPayment/checkout
=======
route.get("/availablePayment",protect,getAvailableGateWay) //http://localhost:5000/api/v1/userPayment/availablePayment
route.post("/chooseGateWay",protect,chooseGateWay)//http://localhost:5000/api/v1/userPayment/chooseGateWay
route.post("/checkout", protect,createCheckout);//http://localhost:5000/api/v1/userPayment/checkout
>>>>>>> seif_test

module.exports=route;