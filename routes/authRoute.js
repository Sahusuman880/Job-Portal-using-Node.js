const express = require("express");
const router = express.Router();
const { handleRegister } = require("../controllers/auth");
const { hashPassword } = require("../middlewares/auth");
const { handleLogin } = require("../controllers/auth");
router.get("/register", (req, res) => {
  return res.status(200).render("register");
});
router.get("/login", (req, res) => {
  return res.status(200).render("login");
});
router.post("/auth/login", handleLogin);
router.post("/auth/register", hashPassword, handleRegister);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
});

module.exports = router;
