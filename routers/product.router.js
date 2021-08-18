const express = require("express");
const {
  getProductlist,
  getProduct,
  addProduct,
  removeAllProducts,
  productIdCheckHandler,
  addReview,
  addDescription,
} = require("../controllers/product.controller");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getProductlist)
  .post(addProduct)
  .delete(removeAllProducts);

productRouter.param("productId", productIdCheckHandler);

productRouter.route("/:productId").get(getProduct).post(addDescription);

productRouter.route("/:productId/:userId").post(addReview);

module.exports = { productRouter };
