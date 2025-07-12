const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  likerName: {
    type: String,
  },
  postTitle: {
    type: String,
  },
  postOwnerName: {
    type: String,
  },
  postOwnerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likerProfile: {
    type: String,
  },
  likes: {
    type: Number,
  },
  isRead: {
    type: Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("notification", notificationSchema);
