const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name must be at least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "User email is required"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "User password is required"],
    minLength: [8, "Password should be at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: [true, "Product image public_id is required"],
    },
    url: {
      type: String,
      required: [true, "Product image url is required"],
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  resetPassword: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function () {
  // console.log(this);
  if (!this.isModified("password")) {
  } else {
    const salt = 10;
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// JWT TOKEN
userSchema.methods.getJWTToKen = function () {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE;
  const jwtToken = jwt.sign({ id: this._id }, secret, { expiresIn });
  return jwtToken;
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating TOKEN
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to userSchema
  const tokenCrypto = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPassword = tokenCrypto;
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
