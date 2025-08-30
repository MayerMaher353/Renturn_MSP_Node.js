const mongoose= require("mongoose");

const paymentTransactionSchema = new mongoose.Schema({
    orderId:{type:mongoose.Types.ObjectId ,ref:"Order",required:true
    },
    paymentMethod:{type:String,enum:["paymob","faswry"],required:true},
    amount:{type:Number,required:true},
    status:{type:String,enum:["pending","paid","faild"],default:"pending"},
    gateWayTransactionId:{type:String},
},{timestamps:true})

module.exports = mongoose.model("PaymentTransaction",paymentTransactionSchema)



