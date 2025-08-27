const {
  paymentModel,
  payMobModel,
  fawryModel,
} = require("../Models/paymentModel");
const asynchandler = require("express-async-handler");
const { decrypt } = require("../utils/crypto");

// Add payment method by admin
exports.addGateWay = asynchandler(async (req, res) => {
  const { type, ...rest } = req.body;
  let gateway;
  if (type === "Paymob") {
    gateway = await payMobModel.create(rest);
  } else if (type === "Fawry") {
    gateway = await fawryModel.create(rest);
  } else {
    return res
      .status(400)
      .json({ status: "failed", message: "Unsupported provider type" });
  }
  res.status(200).json({ status: "success", gateway });
});

//get the payment methods that you have in the server(Admin)
exports.getGatWay = asynchandler(async (req, res) => {
  const gateways = await paymentModel.find();

  const decrypted = gateways.map((gw) => {
    const creds = { ...gw._doc };
    if (gw.type === "paymob") {
      creds.apiKey = decrypt(gw.apiKey);
      creds.hmacSecret = decrypt(gw.hmacSecret);
    }
    if (gw.type === "fawry") {
      creds.securityKey = decrypt(gw.securityKey);
    }
    return creds;
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
  if (gw.type.toLowerCase() === "Paymob") {
    cred.apiKey = decrypt(gw.apiKey);
    cred.hMacSecret = decrypt(gw.hMacSecret);
  } else if (gw.type.toLowerCase() === "Fawry") {
    cred.secureKey = decrypt(gw.secureKey);
  }

  res
    .status(200)
    .json({
      status: "Success",
      message: `you have selected ${gw.type} as your payment method`,
      gateway: { id: gw._id, type: gw.type },
    });
});
