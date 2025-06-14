const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { verifyToken } = require("../middlewares/Auth");

const {
  signupController,
  loginController,
  googleController,
  logout,
  updateProfileImgController,
  updateUsernameController,
  savePostById,
  unsavePostById
} = require("../controllers/UserController");

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google", googleController);
router.post("/logout", verifyToken, logout);
router.post("/save/:postId",verifyToken,savePostById)
router.delete("/unsave/:postId",verifyToken,unsavePostById)
router.patch(
  "/user/profileImg",
  verifyToken,
  upload.single("profile-img"),
  updateProfileImgController
);

router.patch("/user/:email", verifyToken, updateUsernameController);

router.get("/me", verifyToken, async (req, res) => {
  return res.status(200).json({
    message: "hi from /me route",
    user: req.user,
  });
});

module.exports = router;
