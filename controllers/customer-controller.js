const con = require("../database/connection");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { validationResult, Result } = require("express-validator");
const { passwordStrength } = require("check-password-strength");
const { redirect } = require("express/lib/response");
const e = require("express");

exports.products_client = (req, res) => {
  let sessionID = req.session.userid;
  const select1 = "SELECT *FROM productstbl";
  const select2 = "SELECT *FROM categorytbl";

  con.query(select1, function (err, products) {
    if (err) {
      throw err;
    } else {
      con.query(select2, function (err, category) {
        res.render("customer/products", {
          title: "Products",
          category,
          products,
          sessionID,
        });
      });
    }
  });
};

exports.order_client = (req, res) => {
  let sessionID = req.session.userid;
  let p = 0;
  let a = 1;
  let d = 2;
  let c = 3;
  const select = "SELECT *FROM categorytbl";
  const pending = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";
  const approve = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";
  const decline = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";
  const cancelled = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";

  con.query(pending, [p, sessionID], function (err, pen) {
    if (err) {
      throw err;
    } else {
      con.query(approve, [a, sessionID], function (err, app) {
        if (err) {
          throw err;
        } else {
          con.query(decline, [d, sessionID], function (err, dec) {
            if (err) {
              throw err;
            } else {
              con.query(cancelled, [c, sessionID], function (err, can) {
                if (err) {
                  throw err;
                } else {
                  con.query(select, function (err, category) {
                    if (err) {
                      throw err;
                    } else {
                      res.render("customer/orders", {
                        title: "Orders",
                        sessionID,
                        category,
                        pen,
                        app,
                        dec,
                        can,
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.viewProductCustomer = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.params.id;
  const select1 =
    "SELECT * FROM productstbl a INNER JOIN categorytbl b ON a.categoryid = b.categoryid WHERE a.productid = ?";
  const select2 = "SELECT *FROM categorytbl";

  con.query(select1, [id], function (err, product) {
    if (err) {
      throw err;
    } else {
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("customer/viewDetails", {
            title: "View Product",
            sessionID,
            product,
            category,
          });
        }
      });
    }
  });
};

exports.client = (req, res) => {
  let sessionID = req.session.userid;
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
          res.render("customer/index", {
            title: "Home",
            featured,
            category,
            sessionID,
          });
        }
      });
    }
  });
};

exports.ordernow = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.params.id;

  const select1 = "SELECT *FROM `productstbl` WHERE productid = ?";
  const select2 = "SELECT *FROM `categorytbl`";

  con.query(select1, [id], function (err, products) {
    if (err) {
      throw err;
    } else {
      con.query(select2, function (err, category) {
        res.render("customer/orderPage", {
          title: "Order-Page",
          products,
          category,
          sessionID,
        });
      });
    }
  });
};

exports.order_process = (req, res) => {
  let productname = req.body.product_name;
  let userid = req.session.userid;
  let price = req.body.price;
  let fullname = req.body.fullname;
  let billingaddress = req.body.billingaddress;
  let contactnumber = req.body.contactnumber;
  let status = 0;
  let quantity = req.body.quantity;
  let picture = req.body.picture;

  const order =
    "INSERT INTO orderstbl (userid,productname,productimg,productprice,fullname,billingaddress,contactnumber,qty,status) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const select2 = "SELECT *FROM `categorytbl`";
  const select1 = "SELECT *FROM productstbl";
  con.query(
    order,
    [
      userid,
      productname,
      picture,
      price,
      fullname,
      billingaddress,
      contactnumber,
      quantity,
      status,
    ],
    function (err, result) {
      if (err) {
        throw err;
      } else {
        con.query(select2, function (err, category) {
          if (err) {
            throw err;
          } else {
            con.query(select1, function (err, products) {
              res.render("customer/products", {
                title: "Products",
                success: "Successfully Ordered",
                category,
                products,
              });
            });
          }
        });
      }
    }
  );
};

exports.filterProduct = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.params.id;
  const select1 =
    "SELECT *FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid WHERE a.categoryid = ?";
  const select2 = "SELECT *FROM `categorytbl`";

  con.query(select1, [id], function (err, products) {
    if (err) {
      throw err;
    } else {
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("customer/filter", {
            title: "Products",
            category,
            products,
            sessionID,
          });
        }
      });
    }
  });
};

exports.cancel_order = (req, res) => {
  let id = req.body.orderid;
  let sessionID = req.session.userid;
  let update = 3;

  const select = "SELECT *FROM categorytbl";

  const updateQuery = "UPDATE orderstbl SET status = ? WHERE orderid = ?";

  let p = 0;
  let a = 1;
  let d = 2;
  let c = 3;

  const pending = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";
  const approve = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";
  const decline = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";
  const cancelled = "SELECT * FROM orderstbl WHERE status = ? AND userid = ?";

  con.query(updateQuery, [update, id], function (err, result) {
    if (err) {
      throw err;
    } else {
      con.query(select, function (err, category) {
        if (err) {
          throw err;
        } else {
          con.query(pending, [p, sessionID], function (err, pen) {
            if (err) {
              throw err;
            } else {
              con.query(approve, [a, sessionID], function (err, app) {
                if (err) {
                  throw err;
                } else {
                  con.query(decline, [d, sessionID], function (err, dec) {
                    if (err) {
                      throw err;
                    } else {
                      con.query(cancelled, [c, sessionID], function (err, can) {
                        if (err) {
                          throw err;
                        } else {
                          res.render("customer/orders", {
                            title: "Orders",
                            success: "Successfully Cancel your order",
                            sessionID,
                            category,
                            pen,
                            app,
                            dec,
                            can,
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.search_product = (req, res) => {
  let sessionID = req.session.userid;

  let search = req.body.search;

  const select = "SELECT *FROM categorytbl";
  const searchquery =
    "SELECT * FROM productstbl WHERE productname LIKE '%" + search + "%'";

  con.query(searchquery, function (err, products) {
    if (err) {
      throw err;
    } else {
      con.query(select, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("customer/search", {
            title: "Products",
            category,
            products,
            sessionID,
            search,
          });
        }
      });
    }
  });
};
