const express= require("express")
const route = express.Router();
const {getCart,addToCart,updateCartItem,removeFromCart,getCartItemCount}=require("../Controllers/cartController")
const { protect} = require("../middlewares/authMiddleware");

route.get("/",protect,getCart);
route.get("/count",protect,getCartItemCount)
route.post("/",protect,addToCart)
route.put("/:productId",protect,updateCartItem)
route.delete("/:productId",protect,removeFromCart)

module.exports =route;