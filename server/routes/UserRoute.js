const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/Auth");
const USER = require("../models/User");

const {
  signupController,
  loginController,
  googleController,
  logout,
} = require("../controllers/UserController");
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google", googleController);
router.post("/logout", verifyToken, logout);
router.patch("/user/:email", verifyToken, async (req, res) => {
  console.log(req.params.email);
  const { email } = req.params;
  const user = await USER.findOne({ email });
  user.customUsername = req.body.username;
  await user.save();
  return res.status(200).json({
    customUsername,
  });
});
router.get("/me", verifyToken, async (req, res) => {
  console.log("/me route ran", req.user);
  console.log(req.user);
  return res.status(200).json({
    message: "hi from /me route",
    user: req.user,
  });
});
module.exports = router;
