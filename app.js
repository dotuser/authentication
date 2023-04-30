const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const uri =
  "mongodb+srv://hassan:Testing123@generalpurpose.bxoapvc.mongodb.net/authDB?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "mySecret.";

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

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
        if (user.password === req.body.password) {
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
      password: req.body.password,
    });
    user.save();
    res.render("Secrets");
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
