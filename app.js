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

const User = mongoose.model("UserInfo");

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

app.post("/UpdateUser", async(req, res) => {
  const {name, phone, oldPhone} = req.body;
  
  try {
    console.log("OLD PHONE IS " + oldPhone);
    const possibleCurrentUser = await User.findOne({ phone });

    if (possibleCurrentUser) {
      return res.json({ error: "Phone number already belongs to a user"});
    }
  
    const query = {phone: oldPhone};
    await User.updateOne(query, {name: name, phone: phone});
    

    res.send({status: "ok"});
  }
  catch (error) {
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
