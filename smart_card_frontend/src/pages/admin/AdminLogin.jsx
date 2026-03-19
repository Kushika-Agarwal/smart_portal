import React, { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.post(
      `/api/admin/login`,
      // "http://136.114.126.147:5000/api/admin/login",
      { email, password },
    );

    localStorage.setItem("adminToken", res.data.token);
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="flex justify-center items-center  px-4">
      <div className="bg-white/90 backdrop-blur-md border border-white/40 p-8 rounded-xl shadow-xl w-full max-w-md mt-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        {/* Email */}
        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-6 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-3 rounded-lg 
          hover:bg-blue-700 transition duration-200 font-medium"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
