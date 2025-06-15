const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/Auth");
const {saveComment,getAllComments} = require("../controllers/CommentController")

router.post("/:postId",verifyToken,saveComment);
router.get("/all/:postId",verifyToken,getAllComments);
module.exports = router