const express = require("express");
const productRouter = express.Router();

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../controller/productController");

productRouter.route("/").get(getAllProducts);
productRouter
  .route("/admin")
  .get(isAuthenticated, authorizeRoles(["admin"]), getAdminProducts);
productRouter
  .route("/product/new")
  .post(isAuthenticated, authorizeRoles(["admin"]), createProduct);
productRouter
  .route("/product/:id")
  .get(getProductDetails)
  .put(isAuthenticated, authorizeRoles(["admin"]), updateProduct)
  .delete(isAuthenticated, authorizeRoles(["admin"]), deleteProduct);

productRouter.route("/review/:id").put(isAuthenticated, createProductReview);

productRouter
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteProductReview);

module.exports = productRouter;
