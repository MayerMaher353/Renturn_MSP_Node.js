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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
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
  nationalID: {
    type: String,
    // maxlength: 14, 
    // minlength:13,
    required: true,
    select: false,
    length:14,
  },
  phoneNumber:{
    type:String,
    require:true,
    length:11,
    select:true
  },
  resetCode: {
    type: String,
    select: false,
  },
  resetCodeExpires: {
    type: Date,
    select: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const users = mongoose.model("user", userSchema);
module.exports = users;
