const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/Auth");
const postsController = require("../controllers/PostController");

router.post("/", verifyToken, postsController.createPost);
router.get("/all", verifyToken, postsController.getAllPosts);
router.get("/", verifyToken, postsController.getPostsByCategory);
router.post("/liked/:id", verifyToken, postsController.likePost);
router.get("/search", verifyToken, postsController.getPostByQuery);
router.get("/:id", verifyToken, postsController.getPostById);
router.get("/author/:authorName", verifyToken, postsController.getPostsByAuthor);

module.exports = router;
