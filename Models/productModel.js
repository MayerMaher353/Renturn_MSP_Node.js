const mongoose= require('mongoose');

const productModel = new mongoose.Schema({
    product_name:{
        type:String,
        required:true ,
        
    }

}) 