const express = require("express");
const router = express.Router();
const { createCheckout } = require("../Controllers/checkoutController");
router.post("/checkout", createCheckout);
module.exports = router;