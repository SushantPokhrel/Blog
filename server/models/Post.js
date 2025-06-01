const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  authorName: {
    type:   String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subTitle: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim:true
  },
  banner: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: String,
    default: "General",
  },
});

module.exports = mongoose.model("post", postSchema);
