const express = require("express");
const router = express.Router();
const initializePayment = require("../config/paystack.config");

router.post("/initialize", initializePayment.acceptPayment);

module.exports = router;
