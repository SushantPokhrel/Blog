const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/Auth");
const Notifications = require("../models/Notifications");
router.get("/all", verifyToken, async (req, res) => {
  const { user_id } = req.user;
  const notifications = await Notifications.find({
    postOwnerID: user_id,
  }).sort({ createdAt: -1 });
  console.log(notifications);
  res.json(notifications);
});
router.patch("/read", verifyToken, async (req, res) => {
  const { user_id } = req.user;
  try {
    const result = await Notifications.updateMany(
      {
        postOwnerID: user_id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );
    if (result.modifiedCount) {
      return res.status(200).json({
        message: "updated successfully",
      });
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
