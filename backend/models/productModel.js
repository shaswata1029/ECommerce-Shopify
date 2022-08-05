const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    maxLength: [8, "Price cannot exceed 8 figures"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: [true, "Product image public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Product image url is required"],
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
    min: [0, "Product stock cannot be less than 0"],
  },
  numofReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const productModel = mongoose.model("productModel", productSchema);
module.exports = productModel;
