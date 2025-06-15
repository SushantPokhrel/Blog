const USER = require("../models/User");
const POST = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const adminEmail = process.env.ADMIN_EMAIL;
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing username and email
    const [existingUserEmail, existingUserName] = await Promise.all([
      USER.findOne({ email }),
      USER.findOne({ username }),
    ]);

    if (existingUserEmail) {
      return res.status(409).json({ message: "Email already registered" });
    }
    if (existingUserName) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = new USER({ username, email, password });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const User = await USER.findOne({ email });
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    if (User.email === adminEmail) {
      User.role = "admin";
      await User.save();
    }

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        user_id: User._id,
        email: User.email,
        username: User.username,
        role: User.role,
        customUsername: User.customUsername,
        picture: User.picture,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    // Directly set the cookie with environment-based options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000, // 1 hour in ms
    });

    return res.status(200).json({
      message: "Login successful",
      email: User.email,
      username: User.username,
      user_id: User._id,
      role: User.role,
      customUsername: User.customUsername,
      picture: User.picture,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const googleController = async (req, res) => {
  const { code } = req.body;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.OAUTH_REDIRECT_URL,
        grant_type: "authorization_code",
      }),
    });
    const { id_token } = await tokenRes.json();

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    console.log(picture);
    let existingUser = await USER.findOne({ email });

    if (!existingUser) {
      const newUser = new USER({
        email,
        username: name,
        picture,
        googleId,
      });
      if (newUser.email.toLowerCase() === adminEmail.toLowerCase()) {
        newUser.role = "admin";
      }
      await newUser.save();

      const token = jwt.sign(
        {
          user_id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          picture: newUser.picture,
          customUsername: newUser.customUsername,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "55m" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 3600000, // 1 hour in ms
      });

      return res.status(200).json({
        message: "Login successful",
        email: newUser.email,
        username: newUser.username,
        user_id: newUser._id,
        role: newUser.role,
        picture: newUser.picture,
        customUsername: newUser.customUsername,
      });
    }

    const token = jwt.sign(
      {
        user_id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
        picture: existingUser.picture,
        customUsername: existingUser.customUsername,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "55m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000, // 1 hour in ms
    });

    return res.status(200).json({
      message: "Login successful",
      email: existingUser.email,
      username: existingUser.username,
      user_id: existingUser._id,
      role: existingUser.role,
      picture: existingUser.picture,
      customUsername: existingUser.customUsername,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Google login failed" });
  }
};

const updateProfileImgController = async (req, res) => {
  try {
    const { email } = req.user;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const profileImg = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;

    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.picture = profileImg;
    const updatedUser = await user.save();

    const token = jwt.sign(
      {
        user_id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        picture: updatedUser.picture,
        customUsername: updatedUser.customUsername,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "55m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      message: "Updated profile image successfully",
      image: profileImg,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUsernameController = async (req, res) => {
  try {
    const { email } = req.params;
    const { username } = req.body;

    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.customUsername = username;
    const updatedUser = await user.save();

    const token = jwt.sign(
      {
        user_id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        picture: updatedUser.picture,
        customUsername: updatedUser.customUsername,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "55m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000,
    });

    return res.status(200).json({
      customUsername: updatedUser.customUsername,
    });
  } catch (error) {
    console.error("Error updating username:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const savePostById = async (req, res) => {
  const { postId } = req.params;
  const user_id = req.user.user_id;
  const user = await USER.findById(user_id);
  user.savedPosts.push(new mongoose.Types.ObjectId(postId));
  await user.save();
  return res.status(200).json({
    message: "Post saved successfully",
  });
};
const unsavePostById = async (req, res) => {
  const { postId } = req.params;
  const user_id = req.user.user_id;
  const user = await USER.findById(user_id);
  user.savedPosts = user.savedPosts.filter((id) => id.toString() != postId);
  await user.save();
  return res.status(200).json({
    message: "Post removed from your library",
  });
};
const getUserDetails = async (req, res) => {
  const { postId } = req.params;
  const post = await POST.findById(postId).populate("author");
  const user = post.author;
  console.log(user);
  return res.status(200).json(user);
};
const logout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "unauthorized access" });
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
module.exports = {
  signupController,
  loginController,
  googleController,
  updateProfileImgController,
  updateUsernameController,
  savePostById,
  getUserDetails,
  unsavePostById,
  logout,
};
