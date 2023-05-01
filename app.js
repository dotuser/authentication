const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const env = require("dotenv");

const app = express();
env.config();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.URI, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("Home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("Login");
  })
  .post((req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        res.send("User not registered");
      } else {
        if (user.password === md5(req.body.password)) {
          res.render("Secrets");
        } else {
          res.send("Incorrect Password");
        }
      }
    });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("Register");
  })
  .post((req, res) => {
    const user = new User({
      email: req.body.email,
      password: md5(req.body.password),
    });
    user.save();
    res.render("Secrets");
  });

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
