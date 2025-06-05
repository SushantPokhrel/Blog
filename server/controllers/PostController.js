const sanitizeHtml = require("sanitize-html");
const postSchema = require("../models/Post");

const createPost = async (req, res) => {
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
      "*": ["style", "class"],
    },
    allowedSchemes: ["http", "https", "data"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
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
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postSchema.find();

    const updatedPosts = posts.map((post) => {
      const obj = post.toObject();
      obj.likeCount = post.likes.length;
      return obj;
    });

    return res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostsByCategory = async (req, res) => {
  const category = req.query.category;
  console.log(category);

  if (category === "For You") {
    return await getAllPosts(req, res);
  }

  try {
    const posts = await postSchema.find({ category });
    const updatedPosts = posts.map((post) => {
      const obj = post.toObject();
      obj.likeCount = post.likes.length;
      return obj;
    });

    res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const post = await postSchema.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(user_id)) {
      post.likes = post.likes.filter((user) => user?.toString() !== user_id);
    } else {
      post.likes.push(user_id);
    }

    await post.save();

    res.status(200).json({
      likes: post.likes.length,
      liked: post.likes.includes(user_id),
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const post = await postSchema.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const obj = post.toObject();
    obj.likeCount = post.likes.length;
    obj.isLiked = post.likes.includes(user_id);

    res.status(200).json(obj);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👇 Export them as an object
module.exports = {
  createPost,
  getAllPosts,
  getPostsByCategory,
  likePost,
  getPostById,
};
