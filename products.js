const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: String,
    imgUrl: String,
    price: String,
    desc: String,
    sellerPhone: String,
  },
  {
    collection: "Products",
  }
);

mongoose.model("Products", UserDetailsScehma);
