const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      default: "India",
      required: [true, "Country is required"],
    },
    pinCode: {
      type: Number,
      required: [true, "PinCode is required"],
    },
    phoneNo: {
      type: Number,
      required: [true, "PhoneNo is required"],
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, "Ordername is required"],
      },
      price: {
        type: Number,
        required: [true, "Orderprice is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      image: {
        type: String,
        required: [true, "Image is required"],
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "productModel",
        required: [true, "Product is required"],
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: [true, "User is required"],
  },
  paymentInfo: {
    paymentId: {
      type: String,
      required: [true, "PaymentId is required"],
    },
    status: {
      type: String,
      required: [true, "PaymentStatus is required"],
    },
  },
  paidAt: {
    type: Date,
    required: [true, "PaymentDate is required"],
  },
  itemsPrice: {
    type: Number,
    required: [true, "ItemPrice is required"],
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: [true, "ItemPrice is required"],
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: [true, "ShippingPrice is required"],
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: [true, "TotalPrice is required"],
    default: 0,
  },
  orderStatus: {
    type: String,
    required: [true, "OrderStatus is required"],
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const orderModel = mongoose.model("orderModel", orderSchema);
module.exports = orderModel;
