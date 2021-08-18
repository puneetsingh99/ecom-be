const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name field of the user cannot be empty"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email field of the user cannot be empty"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password field of the user cannot be empty"],
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = { UserSchema, User };
