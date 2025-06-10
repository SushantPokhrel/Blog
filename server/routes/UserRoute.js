const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/Auth");
const USER = require("../models/User");
const jwt = require("jsonwebtoken");

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
router.patch("/user/profileImg", verifyToken, async (req, res) => {
  console.log("profileimg route");
  const { profileImg } = req.body;
  if (!profileImg) return;
  const { email } = req.user;
  console.log(email);
  const user = await USER.findOne({ email });
  user.picture = profileImg;
  const updatedUser = await user.save();
  const token = jwt.sign(
    {
      user_id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
      picture: updatedUser.picture,
      customUsername: updatedUser.customUsername,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "55m" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3600000, // 1 hour in ms
  });
  return res.status(200).json({
    message: "updated profile image",
  });
});
router.patch("/user/:email", verifyToken, async (req, res) => {
  const { email } = req.params;
  const user = await USER.findOne({ email });
  const { username } = req.body;
  user.customUsername = username;
  const updatedUser = await user.save();
  console.log("updated userName", updatedUser);
  //re issue jwt and cookie for updated session
  const token = jwt.sign(
    {
      user_id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
      picture: updatedUser.picture,
      customUsername: updatedUser.customUsername,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "55m" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3600000, // 1 hour in ms
  });
  return res.status(200).json({
    customUsername: username,
  });
});

router.get("/me", verifyToken, async (req, res) => {
  console.log("/me route ran");

  return res.status(200).json({
    message: "hi from /me route",
    user: req.user,
  });
});
module.exports = router;
