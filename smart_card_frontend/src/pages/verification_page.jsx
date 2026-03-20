import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setCaptchaUrl(`/api/auth/captcha?${Date.now()}`);
  };

  const validateMobile = (mobile) => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const handleSendOTP = async () => {
    setMessage("");

    if (!validateMobile(mobile)) {
      setMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!captchaInput) {
      setMessage("Please enter captcha");
      return;
    }

    try {
      const captchaRes = await axios.post(
        `/api/auth/verify-captcha`,
        { userInput: captchaInput },
        { withCredentials: true }
      );

      if (!captchaRes.data.success) {
        setMessage("Invalid captcha");
        generateCaptcha();
        return;
      }

      await axios.post(
        `/api/auth/send-otp`,
        { mobile },
        { withCredentials: true }
      );

      setOtpSent(true);
    } catch {
      setMessage(
        "Your registered details are not matching, please contact support."
      );
      generateCaptcha();
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setMessage("Invalid OTP format");
      return;
    }

    try {
      await axios.post(
        `/api/auth/verify-otp`,
        { mobile, otp },
        { withCredentials: true }
      );

      localStorage.setItem("userVerified", "true");
      navigate("/application");
    } catch {
      setMessage("Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 ">
      
      {/* HEADER */}
      <header className="text-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow">
          Smart Card Portal
        </h2>
      </header>

      {/* FORM */}
      <div className="flex justify-center items-center flex-1">
        <div className="bg-white/90 backdrop-blur-md border border-white/40 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md">
          
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
            Mobile Verification
          </h2>

          {/* Mobile Input */}
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded mb-4 text-sm sm:text-base"
          />

          {!otpSent && (
            <>
              {/* CAPTCHA */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                <img
                  src={captchaUrl}
                  alt="captcha"
                  className="border px-3 py-2 bg-gray-100 rounded w-full sm:w-auto"
                />

                <button
                  onClick={generateCaptcha}
                  className="text-blue-600 text-sm"
                >
                  Refresh
                </button>
              </div>

              {/* Captcha Input */}
              <input
                type="text"
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full border p-2 sm:p-3 rounded mb-4 text-sm sm:text-base"
              />

              {/* Continue Button */}
              <button
                onClick={handleSendOTP}
                className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded hover:bg-blue-700 text-sm sm:text-base"
              >
                Continue
              </button>
            </>
          )}

          {otpSent && (
            <>
              {/* OTP Input */}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base"
              />

              <p className="text-xs sm:text-sm mt-3 text-blue-600 flex items-center gap-2 text-center sm:text-left">
                <span className="text-green-500 text-lg">✔</span>
                OTP has been sent to your registered email.
              </p>

              <button
                onClick={handleVerifyOTP}
                className="w-full bg-green-600 text-white py-2 sm:py-3 rounded mt-4 hover:bg-green-700 text-sm sm:text-base"
              >
                Verify & Continue
              </button>
            </>
          )}

          {/* Error Message */}
          {message && (
            <p className="mt-4 text-center text-red-600 text-sm">
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default AuthPage;