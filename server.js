const express = require("express");
const app = express();
const session = require("express-session");

//enable parse JSON request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//server static files
app.use(express.static("public"));
app.use("/images", express.static("public/images"));

//intialized options of session
app.use(
  session({
    secret: "1234ABCD",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.username = req.session.username;
  res.locals.name = req.session.name;
  res.locals.userid = req.session.userid;

  next();
});

app.use("/", require("./routes/account-route"));
app.use("/", require("./routes/admin-route"));
app.use("/", require("./routes/customer-route"));

//set view engine into ejs
app.set("view engine", "ejs");

//set port number
app.listen(3000);
console.log("Server is listening on port 3000");
