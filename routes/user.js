const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signin", async (req, res) => {
  return res.render("signIn");
});

router.get("/signup", async (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });

  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.render("signin", { error: error.message });
  }
});

router.get("/logout", async (req, res) => {
  return res.clearCookie("token").redirect("/");
});

module.exports = router;
