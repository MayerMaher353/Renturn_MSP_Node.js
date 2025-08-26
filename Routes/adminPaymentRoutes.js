const express =require("express")
const {addGateWay,getGatWay,updateGateWay,deleteGateWay}=require("../Controllers/paymentMethodCotroller")
const route = express.Router()
const { protect, authorize } = require("../middlewares/authMiddleware");

// All admin routes require authentication and admin role
route.use(protect);
route.use(authorize("admin"));    

//Admin Routes
route.post("/addGate",addGateWay)
route.get("/gatways",getGatWay)
route.put("/updateGatWay",updateGateWay)
route.delete("/deleteGateWay",deleteGateWay)

module.exports=route;

