const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
dotenv.config({ path: ".env.development" });

const db = require("./DatabaseConnection");
const userRoutes = require("./routes/UserRoute");
const postRoutes = require("./routes/PostRoute");
const commentRoutes = require("./routes/CommentRoute");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
const userSocketMap = new Map();
io.use((socket, next) => {
  // runs on each socket connection attempt
  const { userID } = socket.handshake.auth;
  if (!userID) return;
  socket.userID = userID;

  next();
});
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  userSocketMap.set(socket.userID, socket.id);
  console.log(userSocketMap);
  socket.on("postLiked", (data) => {
    console.log(data);
    const ownerSocketID = userSocketMap.get(data.postOwnerID);
    io.to(ownerSocketID).emit("notifyOwner", data);
  });
  socket.on("disconnect", () => {
    console.log(socket.id);
    if (userSocketMap.get(socket.userID) === socket.id) {
      userSocketMap.delete(socket.userID);
    }
  });
});
const PORT = process.env.PORT || 3000;

// Middlewares
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
db();
app.use(
  express.json({
    limit: "12mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "hi from server" });
});

server.listen(PORT, () => {
  console.log("server started ", PORT);
});
