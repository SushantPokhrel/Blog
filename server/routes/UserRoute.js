const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken")
const router = express.Router();
const client = new OAuth2Client();

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
        redirect_uri: "http://localhost:3000/api/auth/google",
        grant_type: "authorization_code",
      }),
    });

    const { id_token } = await tokenRes.json();

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log(payload);
    const { email, name, picture, sub: googleId } = payload;

    // Optional: create/find user in DB here
    const user = { email, name, picture, googleId };

    // Issue your own JWT
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "60m",
    });

    // Set in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 3600000,
    });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Google login failed" });
  }
});
module.exports = router;
