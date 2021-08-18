const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    title: { type: String, required: true, unique: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    offerPercentage: { type: Number, required: true },
    productType: { type: String, required: true, trim: true },
    fastDelivery: { type: Boolean, required: true },
    inStock: { type: Boolean, required: true },
    category: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    rating: { type: Number, required: true },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: { type: String, trim: true },
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product, ProductSchema };
