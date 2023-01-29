const con = require("../database/connection");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { validationResult, Result } = require("express-validator");
const { passwordStrength } = require("check-password-strength");
const { redirect } = require("express/lib/response");

//login page
exports.categories = (req, res) => {
  let sessionID = req.session.userid;
  const select = "SELECT * FROM categorytbl";
  con.query(select, function (err, categories) {
    if (err) {
      throw err;
    } else {
      res.render("admin/categories", {
        title: "Categories",
        categories,
        sessionID,
      });
    }
  });
};

exports.addCateg = (req, res) => {
  let category = req.body.category;
  let sessionID = req.session.userid;
  const check = "SELECT * FROM `categorytbl` WHERE categoryname = ?";
  con.query(check, [category], function (err, result) {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      const display = "SELECT *FROM `categorytbl`";
      con.query(display, function (err, categories) {
        if (err) {
          throw err;
        } else {
          res.render("admin/categories", {
            title: "Categories",
            error: "Input exist",
            categories,
            sessionID,
          });
        }
      });
    } else {
      const addCateg = `INSERT INTO categorytbl VALUE (NULL, ?)`;
      con.query(addCateg, [category], function (err, result) {
        if (err) {
          throw err;
        } else {
          const display = "SELECT *FROM `categorytbl`";
          con.query(display, function (err, categories) {
            if (err) {
              throw err;
            } else {
              res.render("admin/categories", {
                title: "Categories",
                success: "Successfully Added",
                categories,
                sessionID,
              });
            }
          });
        }
      });
    }
  });
};

exports.deleteCategory = (req, res) => {
  let id = req.body.id;
  let sessionID = req.session.userid;
  const deleteCateg = "DELETE FROM `categorytbl` WHERE categoryid = ?";
  con.query(deleteCateg, [id]);

  const display = "SELECT *FROM `categorytbl`";
  con.query(display, function (err, categories) {
    if (err) {
      throw err;
    } else {
      res.render("admin/categories", {
        title: "Categories",
        success: "Successfully Deleted",
        categories,
        sessionID,
      });
    }
  });
};

//login page
exports.products = (req, res) => {
  let sessionID = req.session.userid;
  const select =
    "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
  con.query(select, function (err, products) {
    if (err) {
      throw err;
    } else {
      const select2 = "SELECT *FROM `categorytbl`";
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("admin/products", {
            title: "Products",
            products,
            category,
            sessionID,
          });
        }
      });
    }
  });
};

exports.deleteProduct = (req, res) => {
  let id = req.body.id;
  let sessionID = req.session.userid;
  const productDelete = "DELETE FROM `productstbl` WHERE productid= ?";
  con.query(productDelete, [id]);

  const select =
    "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
  con.query(select, function (err, products) {
    if (err) {
      throw err;
    } else {
      const select2 = "SELECT *FROM `categorytbl`";
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("admin/products", {
            title: "Products",
            products,
            category,
            sessionID,
            success: "Product Deleted",
          });
        }
      });
    }
  });
};

exports.displayproduct = (req, res) => {
  let id = req.body.id;
  let isfeatured = 1;
  let sessionID = req.session.userid;
  const productDisplay =
    "UPDATE `productstbl` SET isfeatured = ? WHERE productid = ?";
  con.query(productDisplay, [isfeatured, id]);

  const select =
    "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
  con.query(select, function (err, products) {
    if (err) {
      throw err;
    } else {
      const select2 = "SELECT *FROM `categorytbl`";
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("admin/products", {
            title: "Products",
            products,
            category,
            sessionID,
            success: "Product Displayed",
          });
        }
      });
    }
  });
};

exports.hideproduct = (req, res) => {
  let id = req.body.id;
  let isfeatured = 0;
  let sessionID = req.session.userid;
  const productDisplay =
    "UPDATE `productstbl` SET isfeatured = ? WHERE productid = ?";
  con.query(productDisplay, [isfeatured, id]);

  const select =
    "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
  con.query(select, function (err, products) {
    if (err) {
      throw err;
    } else {
      const select2 = "SELECT *FROM `categorytbl`";
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("admin/products", {
            title: "Products",
            products,
            category,
            sessionID,
            success: "Product Hide",
          });
        }
      });
    }
  });
};

exports.addProduct = (req, res) => {
  const select2 = "SELECT *FROM `categorytbl`";
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("admin/add-product", {
            title: "Add Product",
            category
          });
        }
  });
};

exports.editProduct = (req, res) => {
  let id = req.params.id;
  let sessionID = req.session.userid;

  const select1 =
    "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid WHERE a.productid = ?";
  con.query(select1, [id], function (err, products) {
    if (err) {
      throw err;
    } else {
      const select2 = "SELECT *FROM `categorytbl`";
      con.query(select2, function (err, category) {
        if (err) {
          throw err;
        } else {
          res.render("admin/update-product", {
            title: "Update Product",
            sessionID,
            products,
            category,
          });
        }
      });
    }
  });
};

exports.updateProduct = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.body.id;
  let productname = req.body.productname;
  let categoryid = req.body.categoryid;
  let productprice = req.body.productprice;
  let productdesc = req.body.productdesc;
  let clone_name = req.body.clone_name;

  const select1 = "SELECT productname FROM `productstbl` WHERE productname = ?";
  con.query(select1, [productname], function (err, result) {
    if (err) {
      throw err;
    }
    if (result.length > 0 && clone_name != productname) {
      const select2 =
        "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
      con.query(select2, function (err, products) {
        if (err) {
          throw err;
        } else {
          const select3 = "SELECT *FROM `categorytbl`";
          con.query(select3, function (err, category) {
            if (err) {
              throw err;
            } else {
              res.render("admin/products", {
                title: "Products",
                error: "Product name exist",
                products,
                category,
                sessionID,
              });
            }
          });
        }
      });
    } else {
      const update =
        "UPDATE `productstbl` SET `productname` = ?, `productprice` = ?, `categoryid` = ?, productdesc = ? WHERE productid = ?";
      con.query(update, [
        productname,
        productprice,
        categoryid,
        productdesc,
        id,
      ]);

      const select2 =
        "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
      con.query(select2, function (err, products) {
        if (err) {
          throw err;
        } else {
          const select3 = "SELECT *FROM `categorytbl`";
          con.query(select3, function (err, category) {
            if (err) {
              throw err;
            } else {
              res.render("admin/products", {
                title: "Products",
                success: "Updated Successfully",
                products,
                category,
                sessionID,
              });
            }
          });
        }
      });
    }
  });
};

exports.users = (req, res) => {
  let sessionID = req.session.userid;
  const select =
    "SELECT * FROM `accountstbl` WHERE account_level = 1 OR account_level = 3";
  con.query(select, function (err, users) {
    if (err) {
      throw err;
    } else {
      res.render("admin/users", {
        title: "Users",
        users,
        sessionID,
      });
    }
  });
};

exports.banAccount = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.body.id;
  let account_level = 3;

  const account = "UPDATE `accountstbl` SET account_level = ? WHERE id = ?";
  con.query(account, [account_level, id]);

  const select =
    "SELECT * FROM `accountstbl` WHERE account_level = 1 OR account_level = 3";
  con.query(select, function (err, users) {
    if (err) {
      throw err;
    } else {
      res.render("admin/users", {
        title: "Users",
        users,
        success: "Successfully ban account",
        sessionID,
      });
    }
  });
};

exports.unban = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.body.id;
  let account_level = 1;

  const account = "UPDATE `accountstbl` SET account_level = ? WHERE id = ?";
  con.query(account, [account_level, id]);

  const select =
    "SELECT * FROM `accountstbl` WHERE account_level = 1 OR account_level = 3";
  con.query(select, function (err, users) {
    if (err) {
      throw err;
    } else {
      res.render("admin/users", {
        title: "Users",
        users,
        success: "Successfully Unban account",
        sessionID,
      });
    }
  });
};

exports.orders_admin = (req, res) => {
  let sessionID = req.session.userid;

  const select = "SELECT *FROM orderstbl";
  con.query(select, function (err, orders) {
    if (err) {
      throw err;
    } else {
      res.render("admin/orders", {
        title: "Orders",
        orders,
        sessionID,
      });
    }
  });
};

exports.approve_order = (req, res) => {
  let update = 1;
  let id = req.body.id1;
  let sessionID = req.session.userid;
  const select = "SELECT *FROM orderstbl";

  const approve = "UPDATE orderstbl SET status = ? WHERE orderid = ?";

  con.query(approve, [update, id], function (err, result) {
    if (err) {
      throw err;
    } else {
      con.query(select, function (err, orders) {
        if (err) {
          throw err;
        } else {
          res.render("admin/orders", {
            title: "Orders",
            orders,
            sessionID,
            success: "Order Approve",
          });
        }
      });
    }
  });
};

exports.decline_order = (req, res) => {
  let update = 2;
  let id = req.body.id2;
  let sessionID = req.session.userid;
  const select = "SELECT *FROM orderstbl";

  const decline = "UPDATE orderstbl SET status = ? WHERE orderid = ?";

  con.query(decline, [update, id], function (err, result) {
    if (err) {
      throw err;
    } else {
      con.query(select, function (err, orders) {
        if (err) {
          throw err;
        } else {
          res.render("admin/orders", {
            title: "Orders",
            orders,
            success: "Order Declined",
            sessionID,
          });
        }
      });
    }
  });
};

exports.viewProduct = (req, res) => {
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
          res.render("admin/viewProduct", {
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

exports.viewOrder = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.params.id;
  const select1 =
    "SELECT * FROM orderstbl WHERE orderid = ?";

  con.query(select1, [id], function (err, orders) {
    if (err) {
      throw err;
    } else {
      res.render("admin/viewOrder", {
        title: "View Order",
        sessionID,
        orders,
      });
    }
  });
}

exports.printOrder = (req, res) => {
  let sessionID = req.session.userid;
  let id = req.params.id;
  const select1 =
    "SELECT * FROM orderstbl WHERE orderid = ?";

  con.query(select1, [id], function (err, orders) {
    if (err) {
      throw err;
    } else {
      res.render("admin/printOrder", {
        title: "View Order",
        sessionID,
        orders,
      });
    }
  });
}

exports.userProfile = (req, res) => {
      res.render("admin/user-profile", {
        title: "Admin Profile",
      });
};