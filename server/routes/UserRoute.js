const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/Auth");

const {
  signupController,
  loginController,
  googleController,
} = require("../controllers/UserController");
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google", googleController);
router.get("/me", verifyToken, async (req, res) => {
  console.log("/me route ran",req.user);

  res.json({
    message: "hi from /me route",
    user:req.user
  });
});
module.exports = router;
