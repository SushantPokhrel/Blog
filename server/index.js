require("dotenv").config({ path: ".env.development" });

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const db = require("./DatabaseConnection");
const userRoutes = require("./routes/UserRoute");
const postRoutes = require("./routes/PostRoute");
const commentRoutes = require("./routes/CommentRoute");
const notificationRoutes = require("./routes/NotificationRoute");
const Notification = require("./models/Notifications");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const userSocketMap = new Map();

// Socket.IO authentication middleware
io.use((socket, next) => {
  const { userID } = socket.handshake.auth;
  if (!userID) return next(new Error("userID missing in auth"));
  socket.userID = userID;
  next();
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  userSocketMap.set(socket.userID, socket.id);

  socket.on("postLiked", async (data) => {
    try {
      const {
        likedByName,
        postTitle,
        postOwnerName,
        likes,
        postOwnerID,
        likerProfile,
      } = data;

      // Check if a notification for this like already exists
      const existingNotification = await Notification.findOne({
        postTitle,
        likerName: likedByName,
      });

      if (existingNotification) {
        // Notification already exists – do nothing
        return;
      }

      // If not found, create a new notification
      const newNotification = new Notification({
        likerName: likedByName,
        postTitle,
        postOwnerName,
        likes,
        postOwnerID: new mongoose.Types.ObjectId(postOwnerID),
        likerProfile,
      });

      await newNotification.save();
      io.to(userSocketMap.get(postOwnerID)).emit("notifyOwner", {
        likerName: likedByName,
        postTitle,
        postOwnerName,
        likes,
        likerProfile,
        createdAt: new Date(),
        isRead:false
      });
    } catch (error) {
      console.error("Error handling postLiked notification:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userSocketMap.get(socket.userID) === socket.id) {
      userSocketMap.delete(socket.userID);
    }
  });
});

// Middlewares
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Database connection
db();

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "hi from server" });
});
app.use((e, req, res, next) => {
  console.log(e.message);
  return res.status(401).json({ message: "unauthorized access" });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
