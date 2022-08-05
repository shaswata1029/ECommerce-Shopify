const express = require("express");
const userRouter = express.Router();

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
} = require("../controller/authController");

const {
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");

// auth controllers
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/password/forgot").post(forgetPassword);
userRouter.route("/password/reset/:resetToken").put(resetPassword);

// user controllers
userRouter.route("/me").get(isAuthenticated, getUserDetails);
userRouter.route("/password/update").put(isAuthenticated, updatePassword);
userRouter.route("/me/update").put(isAuthenticated, updateProfile);
userRouter
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles(["admin"]), getAllUsers);
userRouter
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles(["admin"]), getSingleUser)
  .put(isAuthenticated, authorizeRoles(["admin"]), updateUser)
  .delete(isAuthenticated, authorizeRoles(["admin"]), deleteUser);

module.exports = userRouter;
