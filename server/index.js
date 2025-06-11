const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });

const cors = require("cors");
const cookieParser = require("cookie-parser");

const db = require("./DatabaseConnection");
const userRoutes = require("./routes/UserRoute");
const postRoutes = require("./routes/PostRoute");
const app = express();
const PORT = process.env.PORT || 3000;
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
// routes
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.get("/", (req, res) => {
  return res.json({ message: "hi from server" });
});
app.listen(PORT, () => {
  console.log("server started ", PORT);
});
