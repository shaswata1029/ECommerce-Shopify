const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

// Register a new user
module.exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const defaultPublicId = process.env.DEFAULT_PUBLIC_ID;
  const defaultUrl = process.env.DEFAULT_URL;

  let isAvatarPresent = true;

  if (avatar === "") isAvatarPresent = false;

  console.log(isAvatarPresent);

  let myCloud;
  if (isAvatarPresent) {
    myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
  }

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: isAvatarPresent ? myCloud.public_id : defaultPublicId,
      url: isAvatarPresent ? myCloud.secure_url : defaultUrl,
    },
  });

  const jwtToken = user.getJWTToKen();

  //   console.log(user);
  sendToken(user, 201, "New user created successfully", res);
});

// Login user
module.exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Checking if email and password exist

  if (!email || !password)
    return next(new ErrorHandler(400, "Please enter email and password"));

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler(401, "Invalid email or password"));

  //   console.log(password);
  const isPasswordMatched = await user.comparePassword(password);
  //   console.log(isPasswordMatched);
  if (!isPasswordMatched)
    return next(new ErrorHandler(401, "Invalid email or password"));

  // console.log(user);
  sendToken(user, 200, "User login successful", res);
});

// Logout user
module.exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, { httpOnly: true, expires: new Date(Date.now()) });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

// Forget password
module.exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  let email = req.body.email;
  if (!email)
    return next(new ErrorHandler(404, "Please enter an  email address"));

  const user = await userModel.findOne({ email: email });
  if (!user)
    return next(new ErrorHandler(404, "User not found with this email"));
  // console.log(user);

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  console.log(resetToken);

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :\n\n ${resetPasswordURL} \n\n If you have not requested this email then,please ignore it`;

  try {
    await sendEmail({
      email: email,
      subject: "Shopify password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (err) {
    user.resetPassword = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(500, err.message));
  }
});

// Reset password when after resetPasswordToken is used
module.exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetToken = req.params.resetToken;

  // Crearting token hash
  if (!resetToken) return next(new ErrorHandler(404, "No resetToken is found"));

  const resetPassword = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  let user = await userModel.findOne({
    resetPassword,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler(404, "Reset password token is invalid or expired")
    );

  const { password, confirmPassword } = req.body;
  if (!password)
    return next(new ErrorHandler(404, "Please enter new password"));
  if (password !== confirmPassword)
    return next(
      new ErrorHandler(404, "Password and ConfirmPassword does not match")
    );

  user.password = password;
  user.resetPassword = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res
    .status(200)
    .json({ success: true, message: "User password changed successfully" });
});
