const router = require("express").Router();
const accCon = require("../controllers/customer-controller");
const { check } = require("express-validator");
const helpers = require("../modules/helpers");
const multer = require("multer");
const path = require("path");
const con = require("../database/connection");

const notIn = (req, res, next) => {
  if (!req.session.userid) {
    res.redirect("/login");
  } else {
    next();
  }
};

router.get("/viewProductCustomer/:id", notIn, accCon.viewProductCustomer);
router.get("/order-now/:id", notIn, accCon.ordernow);
router.get("/client", notIn, accCon.client);
router.get("/products-client", notIn, accCon.products_client);
router.get("/orders-client", notIn, accCon.order_client);

router.get("/filterProduct/:id", notIn, accCon.filterProduct);

router.post("/orderProcess", notIn, accCon.order_process);
router.post("/cancel-orders", notIn, accCon.cancel_order);
router.post("/search-products", notIn, accCon.search_product);
module.exports = router;
