const express = require("express");
const sanitizeHtml = require("sanitize-html");
const postSchema = require("../models/Post");
const router = express.Router();
const { verifyToken } = require("../middlewares/Auth");
// POST /api/posts - Create a new post
router.post("/", verifyToken, async (req, res) => {
  const { content, title, image, category, tags, subTitle } = req.body;

  const cleanHtml = sanitizeHtml(content, {
    allowedTags: [
      "p",
      "b",
      "i",
      "u",
      "em",
      "strong",
      "a",
      "ul",
      "ol",
      "li",
      "br",
      "span",
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "pre",
      "code",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "style"],
      code: ["class", "style"],
      pre: ["class", "style"],
      "*": ["style", "class"], // if you want to allow class on everything
    },
    allowedSchemes: ["http", "https", "data"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowProtocolRelative: false,
  });

  try {
    const { username, user_id } = req.user;
    const newPost = new postSchema({
      title,
      content: cleanHtml,
      banner: image,
      author: user_id,
      tags,
      category,
      subTitle,
      authorName: username,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// GET /api/posts - Fetch all posts
router.get("/all", verifyToken, async (req, res) => {
  try {
    const posts = await postSchema.find();
    console.log(posts);
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postSchema.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
