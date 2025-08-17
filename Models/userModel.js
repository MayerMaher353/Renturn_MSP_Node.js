const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    Math: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  confirmPassword: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  nationalID:{
    type:String,
    maxlegth:14,
    required:true,
    select:false
  },
  date:{
    type:Date,
    default:Date.now
  },
  role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
}
});

const users = mongoose.model("user",userSchema)
module.exports=users;