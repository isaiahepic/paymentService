const express = require("express");
const router = express.Router();

router.use(express.json());

const paystackRouter = require("./paystackRouter");
const userRouter = require("./userRouter");

router.use("/paystack", paystackRouter);
router.use("/user", userRouter);

module.exports = router;
