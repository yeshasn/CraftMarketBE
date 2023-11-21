const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: String,
    imageUrl: String,
    price: String,
    desc: String,
    phone: String,
    name: String,
  },
  {
    collection: "Products",
  }
);

mongoose.model("Products", ProductSchema);
