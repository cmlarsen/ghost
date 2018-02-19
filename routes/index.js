var express = require("express");

var router = express.Router();
// import express from "express";
// var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Ghosty Coach" });
});
router.get("/strava", function(req, res, next) {
  res.redirect("/api/strava-auth");
});
router.get("/phone-collect", function(req, res, next) {
  res.render("phone-collect", { username: "caleblarsen" });
});
router.get("/done", function(req, res, next) {
  res.render("done", { username: "caleblarsen" });
});
// router.get("/phone", function(req, res, next) {
//   res.render("phone-collect", { title: "Ghost Coach" });
// });

// export default router;
module.exports = router;
