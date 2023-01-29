const router = require("express").Router();
const accCon = require("../controllers/admin-controller");
const { check } = require("express-validator");
const helpers = require("../modules/helpers");
const multer = require("multer");
const path = require("path");
const con = require("../database/connection");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const notIn = (req, res, next) => {
  if (!req.session.userid) {
    res.redirect("/login");
  } else {
    next();
  }
};

router.get("/categories", notIn, accCon.categories);

router.get("/products", notIn, accCon.products);

router.get("/add-product", notIn, accCon.addProduct);

router.get("/users", notIn, accCon.users);

router.get("/orders-admin", notIn, accCon.orders_admin);

router.post("/addCateg", notIn, accCon.addCateg);

router.post("/banAccount", notIn, accCon.banAccount);

router.post("/unbanAccount", notIn, accCon.unban);

router.post("/approveOrder", notIn, accCon.approve_order);
router.post("/decline-order", notIn, accCon.decline_order);

router.post("/deleteProduct", notIn, accCon.deleteProduct);
router.post("/deleteCategory", notIn, accCon.deleteCategory);

router.post("/addCateg", notIn, accCon.addCateg);

router.post("/displayProduct", notIn, accCon.displayproduct);

router.post("/hideProduct", notIn, accCon.hideproduct);

router.post("/addProduct", notIn, (req, res) => {
  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
    limits: { fileSize: 5242880 },
  }).single("image");

  upload(req, res, function (err) {
    if (req.fileValidationError) {
      const select =
        "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
      const select2 = "SELECT * FROM `categorytbl`";

      con.query(select, function (err, products) {
        if (err) {
          throw err;
        } else {
          con.query(select2, function (err, category) {
            if (err) {
              throw err;
            } else {
              res.render("admin/products", {
                title: "Products",
                products,
                category,
                error: req.fileValidationError,
              });
            }
          });
        }
      });
    } else if (err instanceof multer.MulterError) {
      const select =
        "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
      const select2 = "SELECT * FROM `categorytbl`";

      con.query(select, function (error, products) {
        if (error) {
          throw error;
        } else {
          con.query(select2, function (error, category) {
            if (error) {
              throw error;
            } else {
              res.render("admin/products", {
                title: "Products",
                products,
                category,
                error: err.message,
              });
            }
          });
        }
      });
    } else {
      if (!req.file) {
        const select =
          "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
        const select2 = "SELECT * FROM `categorytbl`";

        con.query(select, function (err, products) {
          if (err) {
            throw err;
          } else {
            con.query(select2, function (err, category) {
              if (err) {
                throw err;
              } else {
                res.render("admin/products", {
                  title: "Products",
                  products,
                  category,
                  error: "Please select an image to upload.",
                });
              }
            });
          }
        });
      } else {
        //acquire input
        let productname = req.body.productname;
        let categoryid = req.body.categoryid;
        let productdesc = req.body.productdesc;
        let productprice = req.body.productprice;
        let isfeatured = 0;

        //check if product exists
        const checkProd = "SELECT * FROM productstbl WHERE productname = ?";
        con.query(checkProd, [productname], function (err, result) {
          if (err) {
            throw err;
          }
          if (result.length > 0) {
            const select =
              "SELECT * FROM `productstbl` a INNER JOIN `categorytbl` b ON a.categoryid = b.categoryid";
            const select2 = "SELECT * FROM `categorytbl`";

            con.query(select, function (err, products) {
              if (err) {
                throw err;
              } else {
                con.query(select2, function (err, category) {
                  if (err) {
                    throw err;
                  } else {
                    res.render("admin/products", {
                      title: "Products",
                      products,
                      category,
                      error: "Product name exist",
                    });
                  }
                });
              }
            });
          } else {
            const insert =
              "INSERT INTO productstbl (productname, categoryid, productdesc, productprice, isfeatured, productimg) VALUES ( ?, ?, ?, ?, ?, ?)";
            con.query(insert, [
              productname,
              categoryid,
              productdesc,
              productprice,
              isfeatured,
              req.file.filename,
            ]);

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
                      success: "Successfully added",
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});

router.get("/productEdit/:id", notIn, accCon.editProduct);
router.post("/updateProduct", notIn, accCon.updateProduct);
router.get("/viewProduct/:id", notIn, accCon.viewProduct);
router.get("/viewOrder/:id", notIn, accCon.viewOrder);
router.get("/printOrder/:id", notIn, accCon.printOrder);
router.get("/user-profile", notIn, accCon.userProfile);

module.exports = router;
