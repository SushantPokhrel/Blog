const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./DatabaseConnection");
const userRoutes = require("./routes/UserRoute")
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
db();

app.use(express.json());
app.use(express.urlencoded({
  extended:true
}));
app.use(cookieParser());
// routes
app.use("/api/auth",userRoutes)
app.get("/", (req, res) => {
  res.send("<h1>hi from server</h1>");
});
app.listen(PORT, () => {
  console.log("server started ", PORT);
});
