var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", { title: "แปลงขิง the origin", desc: "Welcome!" });
});

module.exports = router;
