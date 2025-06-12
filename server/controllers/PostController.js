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

    const savedPost = await newPost.save();
    console.log(savedPost.title);
    res
      .status(201)
      .json({ message: "Post created successfully", post: savedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};
const editPostById = async (req, res) => {
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
  const { postId } = req.params;
  const user_id = req.user.user_id;
  try {
    const oldPost = await postSchema.findById(postId);
    console.log(oldPost);
    console.log(oldPost.author);
    if (oldPost.author.toString() !== user_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedPost = await postSchema.findByIdAndUpdate(
      postId,
      {
        title,
        subTitle,
        content: cleanHtml,
        banner: image,
        category,
        tags,
      },
      { new: true, runValidators: true } // returns updated and validated post
    );
    console.log(updatedPost.subTitle);
    return res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getAllPosts = async (req, res) => {
  try {
    const posts = await postSchema.find().sort({ createdAt: -1 });

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
    return getAllPosts(req, res);
  }

  try {
    const posts = await postSchema.find({ category }).sort({ createdAt: -1 });
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
const getPostByQuery = async (req, res) => {
  const { query } = req.query;
  console.log(query);
  if (!query || query.trim().length < 3) {
    return res.status(404).json({ message: "No results found" });
  }
  try {
    // Perform a case-insensitive search on 'title' and 'category'
    const results = await postSchema.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });
    if (!results.length) {
      return res.status(404).json({
        message: "No results found",
      });
    }
    return res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
// posts by author
const getPostsByAuthor = async (req, res) => {
  const { authorName } = req.params;
  const posts = await postSchema
    .find({ authorName: authorName })
    .sort({ createdAt: -1 });
  if (!posts.length)
    return res.status(404).json({
      message: "No posts found",
    });
  return res.status(200).json(posts);
};
// like a post
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
  getPostByQuery,
  getPostsByAuthor,
  editPostById,
};
