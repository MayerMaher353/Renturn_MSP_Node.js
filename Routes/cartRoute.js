const express= require("express")
const route = express.Router();
const {getCart,addToCart,updateCartItem,removeFromCart,getCartItemCount}=require("../Controllers/cartController")
const { protect} = require("../middlewares/authMiddleware");

route.get("/",protect,getCart);//https://renturn.vercel.app/api/v1/carts
route.get("/count",protect,getCartItemCount)//https://renturn.vercel.app/api/v1/carts/count
route.post("/",protect,addToCart)//https://renturn.vercel.app/api/v1/carts
route.put("/:productId",protect,updateCartItem)//https://renturn.vercel.app/api/v1/carts/:productId
route.delete("/:productId",protect,removeFromCart) //https://renturn.vercel.app/api/v1/carts/:productId

module.exports =route;