const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
const bcrypt = require("bcryptjs");

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// app.use(cors());

const jwt = require("jsonwebtoken");

const JWT_SECRET = "dlkajsfdoijawlekmadflaslkejflkwjaefklk23948290";

const mongoUrl =
  "mongodb+srv://yeshasnath:Oknmsmongodb1!@craftmarketauth.yh7lbdx.mongodb.net/CraftMarketAuth?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./products");

const User = mongoose.model("UserInfo");
const Products = mongoose.model("Products");

app.post("/products/add", async (req, res) => {
  const { title, imageUrl, price, desc, phone, name } = req.body;
  const productDetail = req.body;

  console.log("Product Detail >>>>", productDetail);

  try {
    await Products.create({
      title,
      imageUrl,
      price,
      desc,
      phone,
      name,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.get("/products/get", async (req, res) => {
  // Products.find((err, data) => {
  //   if (err) {
  //     res.status(500).send(err);
  //   } else {
  //     res.status(200).send(data);
  //   }
  // });
  try {
    const allProducts = await Products.find({});
    res.send({ status: "ok", data: allProducts });
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete-item", async (req, res) => {
  const { itemId } = req.body;
  try {
    Products.deleteOne({ _id: itemId })
      .then((data) => {
        res.send({ status: "ok", data: "deleted" });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    console.log(error);
  }
});

app.post("/register", async (req, res) => {
  const { name, phone, pwd } = req.body;

  const encryptedPassword = await bcrypt.hash(pwd, 10);
  try {
    const oldUser = await User.findOne({ phone });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }

    await User.create({
      name,
      phone,
      pwd: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { phone, pwd } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    return res.json({ error: "User Not Found" });
  }
  if (await bcrypt.compare(pwd, user.pwd)) {
    const token = jwt.sign({ phone: user.phone }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userphone = user.phone;
    User.findOne({ phone: userphone })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.listen(5005, () => {
  console.log("Server started");
});
