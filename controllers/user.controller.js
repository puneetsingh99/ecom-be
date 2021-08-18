const { User } = require("../models/user.model");
const { extend } = require("lodash");

const getUserList = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-__v -email -password")
      .populate("cart wishlist", "-__v");
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not retrieve users",
      errorMessage: error.message,
    });
  }
};

const userIdCheckHandler = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .select("-__v -email -password")
      .populate("cart.product wishlist", "-__v");
    req.id = id;
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not retrieve the user",
      errorMessage: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { user } = req;
    user.__v = undefined;
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not get the user",
      errorMessage: error.message,
    });
  }
};

const removeUser = async (req, res) => {
  try {
    const { user } = req;
    const deletedUser = await User.findByIdAndDelete(user.id);
    return res.json({ success: true, deletedUser });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not remove user",
      errorMessage: error.message,
    });
  }
};

const removeAllUsers = async (req, res) => {
  try {
    const deletedUsers = await User.deleteMany({});
    return res.json({ success: true, deletedUsers });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not remove user",
      errorMessage: error.message,
    });
  }
};

// CART
const addToCart = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const product = await User.findById(userId).select("cart");

    const productAlreadyExists = product.cart.find(
      (cartItem) => String(cartItem.product) === productId
    );

    const { qty } = req.query;

    if (qty) {
      let response;
      response = await User.findById(userId).select("cart");
      const userCart = response.cart;

      const cartWithUpdatedQty = userCart.map((cartItem) => {
        if (String(cartItem.product) === productId) {
          cartItem.qty = parseInt(qty);
        }
        return cartItem;
      });

      response = await User.findByIdAndUpdate(
        userId,
        { cart: cartWithUpdatedQty },
        { new: true }
      ).populate("cart.product", "-__v");

      return res.json({ success: true, updatedCart: response });
    }

    // Add to cart
    if (productAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in the cart",
      });
    }

    const updatedCart = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          cart: { $each: [{ product: productId, qty: 1 }], $position: 0 },
        },
      },
      { new: true }
    )
      .select("cart")
      .populate("cart.product", "-__v");

    return res.json({ success: true, updatedCart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't update the Cart",
      errorMessage: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    const updatedCart = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { product: productId } } },
      { new: true }
    )
      .select("cart")
      .populate("cart.product", "-__v");

    return res.json({ success: true, updatedCart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't remove from Cart",
      errorMessage: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await User.findById(userId)
      .select("cart")
      .populate("cart.product", "-__v");
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not retrieve Cart",
      errorMessage: error.message,
    });
  }
};

// WISHLIST
const getWishList = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await User.findById(userId)
      .select("wishlist")
      .populate("wishlist", "-__v");
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not retrieve the Wishlist",
      errorMessage: error.message,
    });
  }
};

const addToWishList = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const product = await User.findById(userId).select("wishlist");
    const productAlreadyExists = product.wishlist.includes(productId);

    if (productAlreadyExists) {
      return res.json({
        success: false,
        message: "Product already exists in the Wishlist",
      });
    }

    const updatedWishlist = await User.findByIdAndUpdate(
      userId,
      { $push: { wishlist: { $each: [productId], $position: 0 } } },
      { new: true }
    )
      .select("wishlist")
      .populate("wishlist", "-__v");

    return res.json({ success: true, updatedWishlist });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't add to the Wishlist",
      errorMessage: error.message,
    });
  }
};

const removeFromWishList = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    const updatedWishlist = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    )
      .select("wishlist")
      .populate("wishlist", "-__v");

    return res.json({ success: true, updatedWishlist });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't remove from Wishlist",
      errorMessage: error.message,
    });
  }
};

// MOVE TO CART
const moveToCart = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const product = await User.findById(userId).select("cart");

    const productAlreadyExists = product.cart.find(
      (cartItem) => String(cartItem.product) === productId
    );

    if (!productAlreadyExists) {
      //add to cart + remove from the wishlist
      const updatedCart = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            cart: { $each: [{ product: productId, qty: 1 }], $position: 0 },
          },
          $pull: { wishlist: productId },
        },
        { new: true }
      )
        .select("cart wishlist")
        .populate("cart.product wishlist", "-__v");
      return res.json({ success: true, updatedCart });
    } else {
      //only remove from wishlist
      const updatedCart = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true }
      )
        .select("cart wishlist")
        .populate("cart.product wishlist", "-__v");

      return res.json({ success: true, updatedCart });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not move to Cart",
      errorMessage: error.message,
    });
  }
};

// MOVE TO WISHLIST
const moveToWishList = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const product = await User.findById(userId).select("wishlist");

    const productAlreadyExists = product.wishlist.includes(productId);

    if (!productAlreadyExists) {
      //add to wishlist + remove from the cart
      const updatedWishlist = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { cart: { product: productId } },
          $push: { wishlist: { $each: [productId], $position: 0 } },
        },
        { new: true }
      )
        .select("cart wishlist")
        .populate("cart.product wishlist", "-__v");
      return res.json({ success: true, updatedWishlist });
    } else {
      //only  remove from cart
      const updatedWishlist = await User.findByIdAndUpdate(
        userId,
        { $pull: { cart: { product: productId } } },
        { new: true }
      )
        .select("cart wishlist")
        .populate("cart.product wishlist", "-__v");

      return res.json({ success: true, updatedWishlist });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not move to Wishlist",
      errorMessage: error.message,
    });
  }
};

const increaseQty = async (req, res) => {
  try {
    console.log("Increase qty route is  working");
    const { productId, userId } = req.params;
    const { operation } = req.query;
    console.log({ operation });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  removeUser,
  getCart,
  addToCart,
  removeFromCart,
  getWishList,
  addToWishList,
  removeFromWishList,
  getUserList,
  getUser,
  userIdCheckHandler,
  moveToCart,
  moveToWishList,
  removeAllUsers,
  increaseQty,
};
