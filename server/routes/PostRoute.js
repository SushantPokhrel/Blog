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

    const updatedPosts = posts.map((post) => {
      // post.toObject().likeCount = post.likes.length;
      const obj = post.toObject();
      obj.likeCount = post.likes.length;
      return obj;
    });
    return res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// post a like
router.post("/liked/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;
    console.log(typeof user_id);
    const post = await postSchema.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(user_id)) {
      // Unlike
      post.likes = post.likes.filter((user) => user?.toString() !== user_id);
    } else {
      // Like
      post.likes.push(user_id);
    }

    await post.save();

    return res.status(200).json({
      likes: post.likes.length,
      liked: post.likes.includes(user_id), // return liked status
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;
    const post = await postSchema.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a plain object so you can add properties outside the schema
    const obj = post.toObject();
    obj.likeCount = post.likes.length;
    obj.isLiked = post.likes.includes(user_id);

    return res.status(200).json(obj);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
