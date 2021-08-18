const { Product } = require("../models/product.model");

const getProductlist = async (req, res) => {
  try {
    const products = await Product.find({}).select("-__v");
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not fetch products",
      errorMessage: error.message,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = req.body;
    const newProduct = new Product(product);
    const addedProduct = await newProduct.save();
    addedProduct.__v = undefined;
    return res.status(201).json({
      success: true,
      message: "Product successfully added",
      product: addedProduct,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Could not add the product",
      errorMessage: error.message,
    });
  }
};

const removeAllProducts = async (req, res) => {
  try {
    const deletedProducts = await Product.deleteMany({});
    return res.json({ success: true, deletedProducts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not remove all the products",
      errorMessage: error.message,
    });
  }
};

const productIdCheckHandler = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Could not retrieve product",
      errorMessage: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  const { product } = req;
  product.__v = undefined;
  return res.json({ success: true, product });
};

const addReview = async (req, res) => {
  const { productId, userId } = req.params;
  const { review } = req.body;
  try {
    if (review.length === 0) {
      return res.json({
        success: false,
        message: "Could not add the review",
        errorMessage: "Review is empty",
      });
    }
    const updatedReviews = await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          reviews: { $each: [{ user: userId, review: review }], $position: 0 },
        },
      },
      { new: true }
    )
      .select("reviews")
      .populate("reviews.user");
    return res.json({ success: true, updatedReviews });
  } catch (error) {
    return res.json({ success: false, errorMessage: error.message });
  }
};

const addDescription = async (req, res) => {
  const { productId } = req.params;
  const { description } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      description: description,
    });
    return res.json({ success: true, updatedProduct });
  } catch (error) {
    return res.json({ success: false, errorMessage: error.message });
  }
};

module.exports = {
  getProductlist,
  getProduct,
  addReview,
  addProduct,
  productIdCheckHandler,
  removeAllProducts,
  addDescription,
};
