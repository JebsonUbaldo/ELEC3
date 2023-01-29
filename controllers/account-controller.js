const con = require("../database/connection");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { validationResult, Result } = require("express-validator");
const { passwordStrength } = require("check-password-strength");
const { redirect } = require("express/lib/response");

//login page
exports.index = (req, res) => {
  const select = "SELECT *FROM productstbl WHERE isFeatured = 1";
  const select2 = "SELECT *FROM categorytbl";
  con.query(select, function (err, featured) {
    if (err) {
      throw err;
    } else {
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("pages/index", { title: "Home", featured, category });
        }
      });
    }
  });
};

exports.client = (req, res) => {
  const select = "SELECT *FROM productstbl WHERE isFeatured = 1";
  const select2 = "SELECT *FROM categorytbl";
  con.query(select, function (err, featured) {
    if (err) {
      throw err;
    } else {
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("customer/index", { title: "Home", featured, category });
        }
      });
    }
  });
};

exports.adminIndex = (req, res) => {
  const select1 = "SELECT COUNT(id) as count_account FROM accountstbl";
  const select2 = "SELECT COUNT(categoryid) as count_category FROM categorytbl";
  const select3 = "SELECT COUNT(productid) as count_product FROM productstbl";

  con.query(select1, function (err, countAcc) {
    if (err) {
      throw err;
    } else {
      con.query(select2, function (err, countCateg) {
        if (err) {
          throw err;
        } else {
          con.query(select3, function (err, countProduct) {
            if (err) {
              throw err;
            } else {
              res.render("admin/index", {
                title: "Home",
                countAcc,
                countCateg,
                countProduct,
              });
            }
          });
        }
      });
    }
  });
};

exports.login = (req, res) => {
  res.render("pages/login", { title: "Login" });
};

exports.register = (req, res) => {
  res.render("pages/register", { title: "Register" });
};

exports.registerAcc = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render("pages/register", { title: "Register", errors: errors.array() });
  } else {
    let fullname = req.body.fullname;
    let username = req.body.username;
    let password = req.body.password;
    let role = 1;

    if (
      passwordStrength(password).id == 0 ||
      passwordStrength(password).id == 1
    ) {
      res.render("pages/register", {
        title: "Register",
        error:
          "Password must contain: lowercase, uppercase, symbol and/or number",
      });
    } else {
      //check if username is already taken
      const select = "SELECT * FROM accountstbl WHERE username= ?";
      con.query(select, [username], function (err, result) {
        if (err) {
          throw err;
        }
        if (result.length > 0) {
          res.render("pages/register", {
            title: "Register",
            error: "Username is already taken",
          });
        } else {
          bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
              throw err;
            }
            const insert = `INSERT INTO accountstbl VALUE (NULL, ? , ? , ?, ?, NULL)`;
            con.query(
              insert,
              [fullname, username, hash, role],
              function (err, result) {
                if (err) {
                  throw err;
                } else {
                  res.render("pages/register", {
                    title: "Register",
                    success: "Account has been registered.",
                  });
                }
              }
            );
          });
        }
      });
    }
  }
};

exports.loginAcc = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const select = `SELECT *FROM accountstbl WHERE username = ?`;
  con.query(select, [username], function (err, result) {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      if (bcrypt.compareSync(password, result[0].password)) {
        let getID = result[0].id;

        const select2 = `SELECT *FROM accountstbl WHERE id = ?`;
        con.query(select2, [getID], function (err, result1) {
          if (err) {
            throw err;
          }
          if (result1[0].account_level == 1) {
            req.session.userid = result1[0].id;
            req.session.username = result1[0].username;
            req.session.name = result1[0].name;

            res.redirect("/client");
          } else if (result[0].account_level == 0) {
            req.session.userid = result1[0].id;
            req.session.username = result1[0].username;
            req.session.name = result1[0].name;
            res.redirect("/adminIndex");
          } else {
            res.render("pages/login", {
              title: "Login",
              error: "Your account has been banned",
            });
          }
        });
      } else {
        res.render("pages/login", {
          title: "Login",
          error: "Incorrect Password",
        });
      }
    } else {
      res.render("pages/login", {
        title: "Login",
        error: "Account does not exist",
      });
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/index");
};
