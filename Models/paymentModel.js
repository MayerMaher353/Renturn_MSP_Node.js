const mongoose = require("mongoose");
const encrypt= require("../utils/crypto")

const paymentMethodSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    type:{
        type:String,
        required:true,
        enum:["Paymob","Fawry"]
    }
})
 
const paymentModel= mongoose.model("PaymentMethod",paymentMethodSchema);



const paymobSchema = new mongoose.Schema({
    apiKey:{
        type:String,
        required:true,
        trim:true,
        set :v=>encrypt(v)
    },
    integrationId:{
        type:String,
        required:true,
        trim:true,

    },
    iFrame:{
        type:String,
        required:true,
        trim:true
    },
    hMacSecret:{
        type:String,
        required:true,
        trim:true,
        set:v=>encrypt(v)
    }
})
const payMobModel= mongoose.model("Paymob",paymobSchema)


const fawrySchema = new mongoose.Schema({
    merchantCode: {
        type: String,
        required: true,
        trim: true
    },
    secureKey: {
        type: String,
        required: true,
        trim: true,
        set: v => encrypt(v)
    },
    orderWebHookUrl: {
        type: String,
        trim: true
    },
    mode: {
        type: String,
        enum: ["sandbox", "production"],
        default: "sandbox"
    }
});

const fawryModel = mongoose.model("Fawry", fawrySchema);

module.exports={paymentModel,payMobModel,fawryModel}