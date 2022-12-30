const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");

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
  // res.send("Home Page");
  // res.render("index", { title: "Belajar NodeJS" });
  // =====================================
  // SHOW ALL DATA USERS
  // =====================================
  User.find().exec((err, users) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("index", {
        title: "Home Page",
        users: users,
      });
    }
  });
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

// =====================================
// GET :: EDIT USER
// =====================================
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      res.redirect("/");
    } else {
      if (user == null) {
        res.redirect("/");
      } else {
        res.render("edit_user", {
          title: "Edit User",
          user: user,
        });
      }
    }
  });
});

// =====================================
// POST :: UPDATE USER
// =====================================
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_img = "";

  if (req.file) {
    new_img = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_img = req.body.old_image;
  }

  User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_img,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Update berhasil.",
        };
        res.redirect("/");
      }
    }
  );
});

// =====================================
// GET :: DELETE USER
// =====================================
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;

  User.findByIdAndDelete(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }

    if (err) {
      res.json({ type: "danger", message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "User berhasil di-delete.",
      };
      res.redirect("/");
    }
  });
});

module.exports = router;
