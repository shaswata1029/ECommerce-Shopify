const productModel = require("../models/productModel");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Get All products
module.exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.query);
  const resultsPerPage = 5;
  // Default value is 5

  const productsCount = await productModel.countDocuments();

  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;
  const filteredProductsCount = products.length;

  apiFeatures.pagination(resultsPerPage);

  products = await apiFeatures.query.clone();

  // console.log(products);
  res.status(200).json({
    success: true,
    message: "Products retreived successfully",
    products,
    productsCount,
    resultsPerPage,
    filteredProductsCount,
  });
});

// Get Details of a Particular Product
module.exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let productId = req.params.id;
  let product = await productModel.findById(productId);

  if (!product) return next(new ErrorHandler(404, "Product not found"));
  else {
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      product,
    });
  }
});

// Create new review or update the review
module.exports.createProductReview = catchAsyncErrors(
  async (req, res, next) => {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    console.log(req.user._id);

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    let product = await productModel.findById(productId);

    if (!product)
      return next(
        new ErrorHandler(404, `Product not found with id ${productId}`)
      );

    // console.log(product);

    console.log(req.user._id);

    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    console.log(isReviewed);

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.rating = rating;
          review.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numofReviews = product.reviews.length;
    }

    let totalRating = 0;
    product.reviews.forEach((review) => {
      totalRating += review.rating;
    });
    let averageRating = totalRating / product.numofReviews;
    product.rating = averageRating;

    await product.save({ validateBeforeSave: true });

    // console.log(product);

    res
      .status(200)
      .json({ success: true, message: "Review added successfully" });
  }
);

// Admin Routes

// Get All Products(Admin)
module.exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const productsCount = await productModel.countDocuments();

  const products = await productModel.find();
  res.status(200).json({
    successs: true,
    message: "Products retreived successfully",
    products,
    productsCount,
  });
});

// Create a new product
module.exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  // Assigning users id to product model

  req.body.user = req.user._id;

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
      width: 150,
      crop: "scale",
    });
    imagesLink.push({ public_id: result.public_id, url: result.secure_url });
  }

  req.body.images = imagesLink;

  // Creating a new product
  const product = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    message: "New product created successfully",
    product,
  });
});

// Update Product
module.exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let productId = req.params.id;
  let product = await productModel.findById(productId);

  if (!product)
    return next(
      new ErrorHandler(404, `Product not found with id ${productId}`)
    );

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
      // Upload images to cloudinary
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
        width: 150,
        crop: "scale",
      });
      imagesLink.push({ public_id: result.public_id, url: result.secure_url });
    }

    // Delete images from cloudinary server
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    req.body.images = imagesLink;
  }

  product = await productModel.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// Delete Product
module.exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let productId = req.params.id;
  let product = await productModel.findById(productId);

  if (!product)
    return next(
      new ErrorHandler(404, `Product not found with id ${productId}`)
    );

  // Deleting images from cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

// Get All Reviews of a Product
module.exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  let productId = req.query.productId;

  let product = await productModel.findById(productId);

  if (!product)
    return next(new Error(404, `Product not found with id :${productId}`));

  let reviews = product.reviews;

  res
    .status(200)
    .json({ successs: true, message: "Reviews retrieved", reviews });
});

// Delete Product Review
module.exports.deleteProductReview = catchAsyncErrors(
  async (req, res, next) => {
    let productId = req.query.productId;
    let product = await productModel.findById(productId);

    if (!product)
      return next(
        new ErrorHandler(404, `Product not found with id ${productId}`)
      );

    let reviewId = req.query.reviewId;
    if (!reviewId) return next(new ErrorHandler(401, "Review id is required"));

    reviewId = reviewId.toString();

    // console.log(reviewId);

    const reviews = product.reviews.filter((review) => {
      return review._id.toString() !== reviewId;
    });

    // console.log(reviews);

    const numofReviews = reviews.length;

    // Calculating the new rating
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rating;
    });
    let averageRating = 0;
    if (numofReviews > 0) averageRating = totalRating / numofReviews;

    product.reviews = reviews;
    product.numofReviews = numofReviews;
    product.rating = averageRating;

    await product.save({ validateBeforeSave: true });

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  }
);
