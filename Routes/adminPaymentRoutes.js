const express =require("express")
const {addGateWay,getGatWay,updateGateWay,deleteGateWay}=require("../Controllers/paymentMethodCotroller")
const route = express.Router()
const { protect, authorize } = require("../middlewares/authMiddleware");

// All admin routes require authentication and admin role
route.use(protect);
route.use(authorize("admin"));    

//Admin Routes
route.post("/addGate",addGateWay) //https://renturn.vercel.app/api/v1/adminPayment/addGate
route.get("/gatways",getGatWay) //https://renturn.vercel.app/api/v1/adminPayment/gatways
route.put("/updateGatWay/:id",updateGateWay) //https://renturn.vercel.app/api/v1/adminPayment/updateGatWay/:id
route.delete("/deleteGateWay/:id",deleteGateWay) //https://renturn.vercel.app/api/v1/adminPayment/deleteGateWay/:id

module.exports=route;

