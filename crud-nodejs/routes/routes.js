const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image"); // input-file name=image

// router.get("/users", (req, res) => {
//   res.send("All Users");
// });

router.get("/", (req, res) => {
  //   res.send("Home Page");
  res.render("index", { title: "Belajar NodeJS" });
});

router.get("/add", (req, res) => {
  res.render("add_user", { title: "Tambah User" });
});

// =====================================
// POST :: INSERT USER DATA
// =====================================
router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    // image: req.body.image,
    image: req.file.filename,
  });

  user.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "User added succesfully!",
      };
      res.redirect("/");
    }
  });
});

module.exports = router;
