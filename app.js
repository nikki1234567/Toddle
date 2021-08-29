const logger = require("morgan");

const indexRouter = require("./routes/index");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const mongoose = require("mongoose");
var app = express();

const cors = require("cors");

app.use(cors({ origin: true }));

const dbURI =
  "mongodb+srv://nikhilesh_toddle:nikhilesh%402001@cluster0.su5pw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
// function setUser(req, res, next) {
//     const userId = req.body.userId
//     if (userId) {
//       req.user = users.find(user => user.id === userId)
//     }
//     next()
//   }
// app.use(setUser);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

app.use("/backend", indexRouter);
