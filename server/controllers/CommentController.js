const mongoose = require("mongoose");
const COMMENT = require("../models/Comment");
const POST = require("../models/Post");
const saveComment = async (req, res) => {
  const { postId } = req.params;
  const { user_id, username, picture } = req.user;
  const { commentContent } = req.body;
  console.log(postId);
  console.log(commentContent);
  const newComment = new COMMENT({
    content: commentContent,
    username,
    post: new mongoose.Types.ObjectId(postId),
    picture,
  });
  const savedComment = await newComment.save();
  await POST.findByIdAndUpdate(
    postId,
    { $push: { comments: savedComment._id } }, //push new id in comments field
    { new: true }
  );
  return res.status(201).json({
    message: "Comment posted successfully",
    ...savedComment,
  });
};
const getAllComments = async (req, res) => {
  const { postId } = req.params;
  // return all comments documents for this post
  const comments = await COMMENT.find({
    post: new mongoose.Types.ObjectId(postId),
  });
  if (!comments.length) return res.status(404).json(comments);
  return res.status(200).json(comments);
};
module.exports = {
  saveComment,
  getAllComments,
  
};
