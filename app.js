const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
        res.send("User not found");
      } else {
        if (user) {
          bcrypt.compare(req.body.password, user.password, (e, result) => {
            if (result === true) {
              res.render("Secrets");
            } else {
              res.send("!Incorrect Password");
            }
          });
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
    bcrypt.hash(req.body.password, 10, (e, hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user.save();
      res.render("Secrets");
    });
  });

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
