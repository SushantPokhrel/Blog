const express = require("express");
const router = express.Router();


const {
  signupController,
  loginController,
  googleController
} = require("../controllers/UserController");
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google",googleController);
module.exports = router;
