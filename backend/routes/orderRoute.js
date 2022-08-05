const express = require("express");
const orderRouter = express.Router();

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controller/orderController");

orderRouter.route("/new").post(isAuthenticated, newOrder);
orderRouter.route("/orders/:orderId").get(isAuthenticated, getSingleOrder);
orderRouter.route("/me").get(isAuthenticated, myOrders);
orderRouter
  .route("/admin/orders/all")
  .get(isAuthenticated, authorizeRoles(["admin"]), getAllOrders);
orderRouter
  .route("/admin/order/:orderId")
  .put(isAuthenticated, authorizeRoles(["admin"]), updateOrder)
  .delete(isAuthenticated, authorizeRoles(["admin"]), deleteOrder);

module.exports = orderRouter;
