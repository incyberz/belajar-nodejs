// ==============================================
// IMPORTS
// ==============================================
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

// ==============================================
// DATABASE CONNECTION
// ==============================================
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (e) => console.log(e));
db.once("open", () => console.log("Connected to database."));

// ==============================================
// MIDDLEWARES
// ==============================================
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// ==============================================
// SET TEMPLATE ENGINE
// ==============================================
app.set("view engine", "ejs");

// ==============================================
// ROUTING TEMPORER
// ==============================================
// app.get("/", (req, res) => {
//   res.send("Hello World NodeJS!");
// });

// ==============================================
// ROUTE PREFIX
// ==============================================
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server startd at http://localhost:${PORT}`);
});
