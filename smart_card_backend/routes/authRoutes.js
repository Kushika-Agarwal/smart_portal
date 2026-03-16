const express = require("express");
const router = express.Router();
const svgCaptcha = require("svg-captcha");

const auth = require("../controllers/authController");

// ✅ CAPTCHA ROUTE (use router, not app)
router.get("/captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 4,
    color: true,
    background: "#ccf2ff",
    ignoreChars: "0o1ilI",
  });

  req.session.captcha = captcha.text.toLowerCase();

  res.type("svg");
  res.status(200).send(captcha.data);
});

// ✅ VERIFY CAPTCHA ROUTE
router.post("/verify-captcha", (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.json({ success: false });
  }

  if (userInput.toLowerCase() === req.session.captcha) {
    req.session.captcha = null;
    return res.json({ success: true });
  }

  return res.json({ success: false });
});

// OTP ROUTES
router.post("/send-otp", auth.sendOTP);
router.post("/verify-otp", auth.verifyOTP);

module.exports = router;