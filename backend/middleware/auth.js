const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

module.exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  //   console.log(token);

  if (!token)
    return next(new ErrorHandler(401, "Please login to access this resource"));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedData.id;
  const user = await userModel.findById(userId);

  if (!user)
    return next(new ErrorHandler(404, "Invalid JWT.Please login again!!"));

  req.user = user;
  next();
});

module.exports.authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          403,
          `Role :${req.user.role} is not allowed to access this resource`
        )
      );
    }
    return next();
  };
};
