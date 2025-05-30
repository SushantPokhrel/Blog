const express = require("express");
const sanitizeHtml = require("sanitize-html");
const postSchema = require("../models/Post");
const router = express.Router();

// POST /api/posts - Create a new post
router.post("/", async (req, res) => {
  const { content, title, image } = req.body;

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
    const newPost = new postSchema({
      title,
      content: cleanHtml,
      banner: image,
      author: "68342d5e0e4bb033554ede13",
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
router.get("/all", async (req, res) => {
  try {
    const posts = await postSchema.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
