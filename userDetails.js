const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, unique: true },
    pwd: String,
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", UserDetailsScehma);
