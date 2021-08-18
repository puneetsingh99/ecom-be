const { User } = require("../models/user.model");
const { generateToken, successResponse, errorResponse } = require("../utils");
const bcrypt = require("bcrypt");

const SECRET = process.env.SECRET;

const login = (req, res) => {
  if (req.login === "successful") {
    const token = generateToken({ userId: req.userId }, SECRET);

    const user = {
      userId: req.userId,
      token,
    };
    return successResponse(res, {
      message: "Login successful",
      user,
    });
  } else {
    return res.status(500).json({ success: false, message: "Could not login" });
  }
};

const signup = async (req, res) => {
  try {
    const user = req.body;

    const userAlreadyExists = await User.findOne({ email: user.email });

    if (userAlreadyExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const newUser = new User(user);
    newUser.cart = [];
    newUser.wishlist = [];

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const createdUser = await newUser.save();

    const token = generateToken({ userId: createdUser._id }, SECRET);
    const userId = createdUser._id;
    const name = createdUser.name;

    return successResponse(
      res,
      {
        message: "User added successfully",
        user: { userId, name, token },
      },
      201
    );
  } catch (error) {
    return errorResponse(res, "Could not add the user", error);
  }
};

module.exports = { login, signup };
