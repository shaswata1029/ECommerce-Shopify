const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB id error
  if (err.name === "CastError") {
    const message = `Resource not found .Invalid : ${err.path}`;
    err = new ErrorHandler(400, message);
  }

  //   Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(400, message);
  }

  //   Invalid JWT Token Error
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid,try again`;
    err = new ErrorHandler(400, message);
  }

  //   Expired JWT Token error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token expired,try again`;
    err = new ErrorHandler(400, message);
  }

  // console.log(err);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
