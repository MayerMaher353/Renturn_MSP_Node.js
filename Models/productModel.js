const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        trim :true,
    },
    product_description:{
        type:String,
        required:false,
        trim:true,
        maxlength:100,
    },
    qunatity:{
        type:Number,
        min:0,
    },
    price:{
        type:Number,
        min:0,
    },
}) ;


const product = mongoose.model('product',productModel)

module.exports= product ;