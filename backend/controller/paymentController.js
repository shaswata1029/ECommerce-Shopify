const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

module.exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Shopify Ecommerce",
    },
  });

  res.status(200).json({
    success: true,
    message: "Payment successfull",
    client_secret: myPayment.client_secret,
  });
});

module.exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, stripeApiKey: process.env.STRIPE_API_KEY });
});
