const userModel = require("../models/userModel");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

// Get User Details
module.exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  // console.log(userId);

  const user = await userModel.findById(userId);

  res.status(200).json({ success: true, user });
});

// Update user password
module.exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const userId = req.user.id;
  let user = await userModel.findById(userId).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);
  //   console.log(isPasswordMatched);
  if (!isPasswordMatched)
    return next(new ErrorHandler(400, "Old password is incorrect"));

  if (!newPassword)
    return next(new ErrorHandler(400, "Please enter new password"));

  if (newPassword !== confirmPassword)
    return next(
      new ErrorHandler(400, "New password and confirm password does not match")
    );

  user.password = newPassword;
  await user.save();
  sendToken(user, 200, "User password updated  successfully", res);
});

// Update user Profile
module.exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Cloudinary
  if (req.body.avatar !== "") {
    const user = await userModel.findById(req.user.id);

    const defaultPublicId = process.env.DEFAULT_PUBLIC_ID;
    let isDefaultId = false;
    const imageId = user.avatar.public_id;

    if (imageId == defaultPublicId) isDefaultId = true;

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    if (!isDefaultId) await cloudinary.v2.uploader.destroy(imageId);
  }

  let user = await userModel.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // console.log(user);
  res
    .status(200)
    .json({ success: true, message: "User Profile updated successfully" });
});

// Get all users
module.exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await userModel.find();
  res
    .status(200)
    .json({ success: true, message: "Users retreived successfully", users });
});

// Get single user by admin
module.exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  let userId = req.params.id;
  const user = await userModel.findById(userId);

  if (!user)
    return next(new ErrorHandler(404, `User does not exist with id ${userId}`));
  res
    .status(200)
    .json({ success: true, message: "User retreived successfully", user });
});

// Update user profile by admin
module.exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  console.log(newUserData);

  let user = await userModel.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user)
    return next(new ErrorHandler(404, `User does not exist with id ${userId}`));

  console.log(user);
  res
    .status(200)
    .json({ success: true, message: "User Profile updated successfully" });
});

// Delete user by admin
module.exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);

  const defaultPublicId = process.env.DEFAULT_PUBLIC_ID;

  if (!user)
    return next(new ErrorHandler(404, `User does not exist with id ${userId}`));

  if (user.role === "admin") {
    return next(
      new ErrorHandler(404, `User with role admin can not be deleted`)
    );
  }

  const imageId = user.avatar.public_id;
  let isDefaultId = false;

  if (imageId == defaultPublicId) isDefaultId = true;

  if (!isDefaultId) await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();
  res
    .status(200)
    .json({ success: true, message: "User Profile deleted successfully" });
});
