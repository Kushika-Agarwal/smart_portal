import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


function SuccessPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const queryNumber = location.state?.queryNumber || "Not Available";

  return (

 

      <div className="flex justify-center items-center min-h-[70vh] px-4">

        <div className="bg-white/90 backdrop-blur-md border border-white/40 p-10 rounded-xl shadow-xl text-center w-full max-w-md">

          {/* Title */}
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Submission Successful
          </h1>

          {/* Message */}
          <p className="text-gray-700 ">
            Thank you for submitting your query.
          </p>

          {/* Query ID */}
          <div className="bg-gray-100 p-4 rounded-lg ">

            <p className="text-sm text-gray-600">
              Your Query ID
            </p>

            <p className="text-xl font-bold text-blue-600">
              {queryNumber}
            </p>

          </div>

          {/* Info */}
          <p className="text-gray-600 text-sm mb-6">
            You will receive an email with the status within 2 days.
          </p>
        <p className="mt-4 text-sm text-gray-700 bg-blue-50 px-4 pb-3 rounded-lg border border-blue-100">
  If you have any additional point or query, you can write it to us on{" "}
  <a
    href="mailto:Helpdesk.CSDte@PSQuickIT.com"
    className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
  >
    Helpdesk.CSDte@PSQuickIT.com
  </a>
</p>
          {/* Button */}
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </button>

        </div>

      </div>

  

  );
}

export default SuccessPage;