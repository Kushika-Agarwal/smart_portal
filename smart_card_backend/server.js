const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const svgCaptcha = require("svg-captcha");
const session = require("express-session");
// app.use(cors());
app.use(
 
  cors({
    origin: [
      "http://localhost:5173",
      "http://136.114.126.147:5173",
      "http://urccardstatuscheck.psquickit.net"
    ],
    credentials: true,
  })
);
         
    
app.use(express.json());

app.use(
  session({
    secret: "yourSecretKey123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,      // change to true AFTER HTTPS
      httpOnly: true,
      sameSite: "lax",    // now safe since same domain
    },
  })
);
const PORT = process.env.PORT || 5000;
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/application", require("./routes/applicationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.listen(PORT,()=>{
  console.log("Server running on port " + PORT);
});