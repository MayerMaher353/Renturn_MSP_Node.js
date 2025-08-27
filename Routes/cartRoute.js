const express= require("express")
const route = express.Router();
const {getCart,addToCart,updateCartItem,removeFromCart,getCartItemCount}=require("../Controllers/cartController")

route.get("/",getCart);
route.get("/count",getCartItemCount)
route.post("/",addToCart)
route.put("/:productId",updateCartItem)
route.delete("/:productId",removeFromCart)

module.exports =route;