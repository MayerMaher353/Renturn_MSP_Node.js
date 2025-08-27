const {
  paymentModel,
  payMobModel,
  fawryModel,
} = require("../Models/paymentModel");
const asynchandler = require("express-async-handler");
const crypto = require("crypto");
const { encrypt, decrypt } = require("../utils/crypto");

function hashValue(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// Add payment method by admin
exports.addGateWay = asynchandler(async (req, res) => {
  const { type, name, ...rest } = req.body;
  let config;
  if (type === "paymob") {
    const exists = await payMobModel.findOne({ apiKeyHash: hashValue(rest.apiKey) });
    if (exists) {
      return res
        .status(400)
        .json({ status: "failed", message: "This apiKey already exits" });
    }
    config = await payMobModel.create({
      ...rest,
      apiKey: encrypt(rest.apiKey),
      apiKeyHash: hashValue(rest.apiKey),
      hMacSecret: encrypt(rest.hMacSecret),
    });
  } else if (type === "fawry") {
    const exists = await fawryModel.findOne({
      secureKeyHash: hashValue(rest.secureKey),
    });
    if (exists) {
      return res
        .status(400)
        .json({ status: "faild", message: "This secureKey already exists" });
    }
    config = await fawryModel.create({
      ...rest,
      secureKey: encrypt(rest.secureKey),
      secureKeyHash: hashValue(rest.secureKey),
    });
  } else {
    return res
      .status(400)
      .json({ status: "failed", message: "Unsupported provider type" });
  }
  const gateway = await paymentModel.create({ name, type, config: config._id });
  res.status(200).json({ status: "success", gateway });
});

//get the payment methods that you have in the server(Admin)
exports.getGatWay = asynchandler(async (req, res) => {
  const gateways = await paymentModel.find().populate("config");

  const decrypted = gateways.map((gw) => {
    const creds = gw.config.toObject();
    if (gw.type === "paymob") {
      creds.apiKey = decrypt(creds.apiKey);
      creds.hMacSecret = decrypt(creds.hMacSecret);
    }
    if (gw.type === "fawry") {
      creds.securityKey = decrypt(gw.securityKey);
    }
    return { ...gw.toObject(), config: creds };
  });

  res.json({ status: "Success", gateways: decrypted });
});

//udpate date on specific gateway such as apikey in paymob payment method(Admin)
exports.updateGateWay = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { cred } = req.body;
  const gateway = await paymentModel.findByIdAndUpdate(
    id,
    { ...cred },
    { new: true, runValidators: true }
  );

  if (!gateway) {
    res.status(404).json({ status: "Faild", message: "Gatway not found" });
  }

  res.status(200).json({ status: "Success", gateway });
});

//delete specific gateway payment(Admin)
exports.deleteGateWay = asynchandler(async (req, res) => {
  const { id } = req.params;
  const gateway = await paymentModel.findByIdAndDelete(id);
  if (!gateway) {
    res.status(404).json({ status: "Faild", message: "Gateway not found" });
  }
  res
    .status(200)
    .json({ status: "Success", message: "Gateway deleted successfully" });
});

//get
//User can see the available gate ways
exports.getAvailableGateWay = asynchandler(async (req, res) => {
  const availableGateWay = await paymentModel.find().select("type name");
  res.status(200).json({ status: "Success", availableGateWay });
});
//get method that allow user choose the way of payment fawry or paymob
exports.chooseGateWay = asynchandler(async (req, res) => {
  const { gateway } = req.body;
  const gw = await paymentModel.findById(gateway);
  if (!gw) {
    res.status(404).json({ status: "Faild", message: "Gateway noot found" });
  }

  //decoded the protected data
  const cred = gw.toObject();
  if (gw.type === "paymob") {
    cred.apiKey = decrypt(gw.apiKey);
    cred.hMacSecret = decrypt(gw.hMacSecret);
  } else if (gw.type === "fawry") {
    cred.secureKey = decrypt(gw.secureKey);
  }

  res.status(200).json({
    status: "Success",
    message: `you have selected ${gw.type} as your payment method`,
    gateway: { id: gw._id, type: gw.type },
  });
});
