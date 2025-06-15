// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post", // 💡 This tells you which post the comment belongs to
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "",
    
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comment", commentSchema);
