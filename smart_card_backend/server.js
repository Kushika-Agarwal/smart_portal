const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const svgCaptcha = require("svg-captcha");
const session = require("express-session");
// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "yourSecretKey123", // change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true only in HTTPS
  })
);
const PORT = process.env.PORT || 5000;
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/application", require("./routes/applicationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.listen(PORT,()=>{
  console.log("Server running on port " + PORT);
});