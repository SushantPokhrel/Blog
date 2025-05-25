const USER = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminEmail = process.env.ADMIN_EMAIL;

const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check required fields
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
    if (!email || !password)
      return res.status(400).json({
        message: "All fields are required",
      });
    // find user
    const User = await USER.findOne({ email });
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }
    //assign role for admin
    if (User.email === adminEmail) {
      User.role = "admin";
      await User.save();
    }
    //compare password
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // generate jwt token if password matches
    const token = jwt.sign(
      {
        user_id: User._id,
        email: User.email,
        username: User.username,
        role: User.role,
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
      email: User.email,
      username: User.username,
      user_id: User._id,
      role: User.role,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
module.exports = { signupController,loginController };
