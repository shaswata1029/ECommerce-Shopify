const express = require("express");
const paymentRouter = express.Router();

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const { processPayment,sendStripeApiKey } = require("../controller/paymentController");

paymentRouter.route("/process").post(isAuthenticated, processPayment);
paymentRouter.route("/stripeapikey").get(isAuthenticated, sendStripeApiKey);

module.exports = paymentRouter;
