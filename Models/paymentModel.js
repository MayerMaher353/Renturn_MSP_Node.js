const mongoose = require("mongoose");
const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: { type: String, enum: ["paymob", "fawry"], required: true },
  config: { type: mongoose.Schema.Types.ObjectId, refPath: "type" },
});

const paymentModel = mongoose.model("PaymentMethod", paymentMethodSchema);

const paymobSchema = new mongoose.Schema({
  apiKey: { type: String, required: true, trim: true ,unique:true},
  apiKeyHash: { type: String, unique: true },
  integrationId: { type: Number, required: true, trim: true },
  iFrame: { type: Number, required: true, trim: true },
  hMacSecret: { type: String, required: true, trim: true ,unique:true},
});
const payMobModel = mongoose.model("paymob", paymobSchema);
// This is just expectig Model
const fawrySchema = new mongoose.Schema({
  merchantCode: {
    type: String,
    required: true,
    trim: true,
  },
  secureKey: {
    type: String,
    required: true,
    trim: true,
  },
  secureKeyHash: { type: String, unique: true },
  orderWebHookUrl: {
    type: String,
    trim: true,
  },
  mode: {
    type: String,
    enum: ["sandbox", "production"],
    default: "sandbox",
  },
});

const fawryModel = mongoose.model("fawry", fawrySchema);

module.exports = { paymentModel, payMobModel, fawryModel };