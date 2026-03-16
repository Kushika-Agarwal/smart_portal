const db = require("../config/db");
const transporter = require("../config/email");
const bcrypt = require("bcrypt");
const svgCaptcha = require("svg-captcha");

const { generateOTP } = require("../utils/otp");


/* ================= CAPTCHA ================= */

// Generate Captcha
exports.generateCaptcha = (req, res) => {
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
};


// Verify Captcha
exports.verifyCaptcha = (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.json({ success: false });
  }

  if (userInput.toLowerCase() === req.session.captcha) {
    req.session.captcha = null;
    return res.json({ success: true });
  }

  return res.json({ success: false });
};


/* ================= OTP ================= */

// Send OTP
exports.sendOTP = async (req, res) => {

  const { mobile } = req.body;

  db.query(
    "SELECT email FROM users WHERE mobile=?",
    [mobile],
    async (err, result) => {

      if (!result || result.length === 0)
        return res.status(404).json({ message: "Mobile not found" });

      const email = result[0].email;

      const otp = generateOTP();
      const hash = await bcrypt.hash(otp, 10);
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      db.query(
        "INSERT INTO otp_codes (mobile, otp_hash, expires_at) VALUES (?,?,?)",
        [mobile, hash, expiry]
      );

      await transporter.sendMail({
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`
      });

      res.json({ message: "OTP sent" });
    }
  );
};


// Verify OTP
exports.verifyOTP = (req, res) => {

  const { mobile, otp } = req.body;

  db.query(
    "SELECT * FROM otp_codes WHERE mobile=? ORDER BY expires_at DESC LIMIT 1",
    [mobile],
    async (err, result) => {

      if (!result || result.length === 0)
        return res.status(400).json({ message: "OTP not found" });

      const record = result[0];

      const valid = await bcrypt.compare(otp, record.otp_hash);

      if (!valid)
        return res.status(400).json({ message: "Invalid OTP" });

      if (new Date(record.expires_at) < new Date())
        return res.status(400).json({ message: "OTP expired" });
req.session.mobile = mobile;
      res.json({ message: "Verified" });
    }
  );
};