require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");

const paymentRouter = express.Router();

smallestCurrencyUnit = {
  INR: 100,
  USD: 100,
  GBP: 100,
  BRL: 100,
  KRW: 100,
  JPY: 1,
};

const getAmount = (amount, currency) => {
  return Math.round(amount * smallestCurrencyUnit[currency]);
};

paymentRouter.route("/orders").post(async (req, res) => {
  try {
    const { total, currencyISOCode } = req.body;
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: getAmount(total, currencyISOCode),
      currency: currencyISOCode,
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

paymentRouter.route("/success").post(async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = { paymentRouter };
