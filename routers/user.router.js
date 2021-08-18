const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  getWishList,
  getUserList,
  getUser,
  userIdCheckHandler,
  addToWishList,
  removeFromWishList,
  moveToCart,
  moveToWishList,
  removeUser,
  removeAllUsers,
  increaseQty,
} = require("../controllers/user.controller");
const { productIdCheckHandler } = require("../controllers/product.controller");
const { signup } = require("../controllers/auth.controller");
const { verifyAuth } = require("../middlewares/verify-auth.middleware");

const userRouter = express.Router();

userRouter.route("/").get(getUserList).post(signup).delete(removeAllUsers);

userRouter.use(verifyAuth);
userRouter.param("userId", userIdCheckHandler);
userRouter.param("productId", productIdCheckHandler);

userRouter.route("/:userId").get(getUser).delete(removeUser);

userRouter.route("/:userId/cart").get(getCart);

userRouter
  .route("/:userId/cart/:productId")
  .post(addToCart)
  .delete(removeFromCart);

userRouter.route("/:userId/cart/:productId?qty=:qty").post(increaseQty);

userRouter
  .route("/:userId/wishlist/:productId")
  .post(addToWishList)
  .delete(removeFromWishList);

userRouter.route("/:userId/wishlist").get(getWishList);

userRouter.route("/:userId/movetocart/:productId").post(moveToCart);

userRouter.route("/:userId/movetowishlist/:productId").post(moveToWishList);

module.exports = { userRouter };
