const express = require("express");
const rootRouter = express.Router();

const productRouter = require("./productRoute");
const userRouter = require("./userRoute");
const orderRouter = require("./orderRoute");
const paymentRouter = require("./paymentRoute");

rootRouter.use("/products", productRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/payment", paymentRouter);

module.exports = rootRouter;
