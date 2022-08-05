const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create New Order
module.exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res
    .status(201)
    .json({ success: true, message: "Order created successfully", order });
});

module.exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.orderId;
  if (!orderId) return next(new ErrorHandler(401, "OrderId must be provided"));

  const order = await orderModel
    .findById(orderId)
    .populate("user", "name email")
    .populate("orderItems.product");

  if (!order)
    return next(new ErrorHandler(404, `Order not found with id ${orderId}`));

  return res
    .status(200)
    .json({ success: true, message: "Order found successfully", order });
});

// Get loggedIn User Orders
module.exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const orders = await orderModel.find({ user: userId });

  if (!orders)
    return next(new ErrorHandler(404, `Order not found with id ${orderId}`));

  return res
    .status(200)
    .json({ success: true, message: "Orders retreived successfully", orders });
});

// Get All orders--Admin
module.exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find();

  if (!orders) return next(new ErrorHandler(404, `Orders not found`));

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  return res.status(200).json({
    success: true,
    message: "Orders retreived successfully",
    totalAmount,
    orders,
  });
});

// Update Order Status--Admin
module.exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await orderModel.findById(orderId);

  if (!order)
    return next(new ErrorHandler(404, `Order not found with id ${orderId}`));

  if (order.orderStatus === "Delivered")
    return next(
      new ErrorHandler(401, "You have all already delivered this order")
    );

  let newOrderStatus = req.body.status;

  if (newOrderStatus === "Shipped") {
    // Check whether shipping is possible or not
    for (let i = 0; i < order.orderItems.length; i++) {
      let result = await checkProductForShipping(
        order.orderItems[i].product,
        order.orderItems[i].quantity
      );

      if (result === false) {
        return next(
          new ErrorHandler(
            404,
            "Order can't be shipped this time due to insufficient stock"
          )
        );
      }
    }

    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
  }

  order.orderStatus = newOrderStatus;
  if (newOrderStatus === "Delivered") order.deliveredAt = Date.now();

  await order.save({ validateBeforeSave: true });

  return res.status(200).json({
    success: true,
    message: "Order Updated successfully",
    order,
  });
});

async function checkProductForShipping(productId, quantity) {
  let product = await productModel.findById(productId);

  if (product.stock - quantity < 0) return false;

  return true;
}

async function updateStock(productId, quantity) {
  let product = await productModel.findById(productId);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: true });
}

// Delete Order--Admin
module.exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await orderModel.findById(orderId);

  if (!order)
    return next(new ErrorHandler(404, `Order not found with id ${orderId}`));

  await order.remove();

  return res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
