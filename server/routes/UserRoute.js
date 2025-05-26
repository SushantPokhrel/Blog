const express = require("express");
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const router = express.Router();
const client = new OAuth2Client();
const USER = require("../models/User");
const adminEmail = process.env.ADMIN_EMAIL;

const {
  signupController,
  loginController,
} = require("../controllers/UserController");
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google", async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange the code for tokens
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

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    console.log(ticket);
    const payload = ticket.getPayload();
    console.log(payload);
    const { email, name, picture, sub: googleId } = payload;

    // Optional: create/find user in DB here
    let existingUser = await USER.findOne({ email });

    if (!existingUser) {
      // User doesn't exist, create new
      const newUser = new USER({
        email,
        username: name,
        picture,
        googleId,
      });
      if (newUser.email === adminEmail) {
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
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "60m" } // token expires in 60 minutes
      );

      // return a cookie to client
      res.cookie("token", token, {
        httpOnly: true, // only access via server
        secure: false, //dev=false
        sameSite: "lax", // development
        maxAge: 3600000, //1hr in ms
      });
      return res.status(200).json({
        message: "Login successful",
        email: newUser.email,
        username: newUser.username,
        user_id: newUser._id,
        role: newUser.role,
        picture: newUser.picture,
      });
    }

    const token = jwt.sign(
      {
        user_id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
        picture: existingUser.picture,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60m" } // token expires in 60 minutes
    );

    // return a cookie to client
    res.cookie("token", token, {
      httpOnly: true, // only access via server
      secure: false, //dev=false
      sameSite: "lax", // development
      maxAge: 3600000, //1hr in ms
    });
    return res.status(200).json({
      message: "Login successful",
      email: existingUser.email,
      username: existingUser.username,
      user_id: existingUser._id,
      role: existingUser.role,
      picture: existingUser.picture,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Google login failed" });
  }
});
module.exports = router;
