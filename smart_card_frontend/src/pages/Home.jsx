

import React from "react";
import { useNavigate } from "react-router-dom";


function Home() {

  const navigate = useNavigate();

  const handleCheckStatus = () => {
    navigate("/verification");
  };

  return (


      <div className="flex flex-1 flex-col justify-center items-center text-center px-6 md:px-20 pt-5">

        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow">
          Smart Card Portal
        </h2>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 max-w-4xl leading-relaxed drop-shadow">
          This portal is designed for beneficiaries whose mobile number and email
          are registered with the Smart Card team and who have applied for cards
          through offline mode.
        </h1>

        <p className="text-white/90 text-lg mb-10 max-w-xl">
          Check your application status securely using your registered mobile
          number.
        </p>

        <button
          onClick={handleCheckStatus}
          className="
            bg-white
            text-blue-700
            hover:bg-gray-100
            font-semibold
            px-8
            py-3
            rounded-lg
            shadow-lg
            transition
            duration-200
          "
        >
          Check Status
        </button>

      </div>

   
  );
}

export default Home;