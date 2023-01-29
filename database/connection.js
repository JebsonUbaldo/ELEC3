const mysql = require("mysql");
//create connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommercedb",
});

con.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("DB Connected");
  }
});

module.exports = con;
