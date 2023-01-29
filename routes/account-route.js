const router = require("express").Router();
const accCon = require("../controllers/account-controller");
const { check } = require("express-validator");

const notIn = (req, res, next) => {
  if (!req.session.userid) {
    res.redirect("/pages/login");
  } else {
    next();
  }
};

router.post(
  "/registerAcc",
  check("fullname").notEmpty().withMessage("Full name is required!"),
  check("username").notEmpty().withMessage("Username is required!"),
  check("password").notEmpty().withMessage("Password is required!"),
  check("confirm_pass")
    .notEmpty()
    .withMessage("Please fill the password confirmation!")
    .bail(),
  check("confirm_pass").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password!");
    }
    return true;
  }),
  accCon.registerAcc
);

router.get("/index", accCon.index);
router.get("/client", notIn, accCon.client);
router.get("/adminIndex", notIn, accCon.adminIndex);
router.get("/login", accCon.login);
router.get("/register", accCon.register);
router.post("/loginAcc", accCon.loginAcc);
router.get("/logout", accCon.logout);

module.exports = router;
