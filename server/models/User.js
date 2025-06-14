const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  customUsername: {
    type: String,
    required: false,
    unique: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    unique: false,
  },
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  picture: { type: String },
  googleId: { type: String }, // optional
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password not changed
  this.password = await bcrypt.hash(this.password, 10); //  Hash if modified or first time

  next();
});
module.exports = mongoose.model("user", userSchema);
