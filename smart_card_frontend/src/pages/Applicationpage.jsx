import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ApplicationForm() {
  const navigate = useNavigate();

  useEffect(() => {
    const verified = localStorage.getItem("userVerified");

    if (!verified) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    applicationId: "",
    paymentTransferNo: "",
    urcCode: "",
    query: "",
  });

  const [errors, setErrors] = useState({});
  const maxQueryLength = 300;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "query" && value.length > maxQueryLength) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.applicationId.trim())
      newErrors.applicationId = "Application number is required";

    if (!formData.paymentTransferNo.trim())
      newErrors.paymentTransferNo = "Enter the payment transfer number";

    if (!formData.urcCode.trim()) newErrors.urcCode = "Enter the URC code";

    if (!formData.query.trim()) newErrors.query = "Write your query here";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/application/submit`,
        //"http://136.114.126.147:5000/api/application/submit",
        formData,
        { withCredentials: true },
      );

      const queryNumber = res.data.queryNumber;

      navigate("/success", {
        state: { queryNumber },
      });
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "Submission failed",
      );
    }
  };

  const InfoButton = ({ text }) => (
    <button
      type="button"
      title={text}
      className="ml-2 text-blue-600 hover:text-blue-800 font-bold border border-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
    >
      i
    </button>
  );

  return (
    <div className="w-full flex justify-center items-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md border border-white/40 p-8 rounded-xl shadow-xl w-full max-w-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Submit Your Query
        </h2>

        {/* Application ID */}
        <label className="flex items-center font-medium">
          Application ID
          <InfoButton text="Please enter your Application Id that you received on submission of your card application" />
        </label>

        <input
          type="text"
          name="applicationId"
          value={formData.applicationId}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1 mb-1"
        />

        {errors.applicationId && (
          <p className="text-red-500 text-sm mb-3">{errors.applicationId}</p>
        )}

        {/* Payment Transfer No */}
        <label className="flex items-center font-medium">
          Payment Transfer No.
          <InfoButton text="Include UTR number on payment reference number. If you donot have it, you can contact the URC through which you have submitted the application " />
        </label>

        <input
          type="text"
          name="paymentTransferNo"
          value={formData.paymentTransferNo}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1 mb-1"
        />

        {errors.paymentTransferNo && (
          <p className="text-red-500 text-sm mb-3">
            {errors.paymentTransferNo}
          </p>
        )}

        {/* URC Code */}
        <label className="flex items-center font-medium">
          URC Code
          <InfoButton text="Provide the code of URC where you have submitted your application." />
        </label>

        <input
          type="text"
          name="urcCode"
          value={formData.urcCode}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1 mb-1"
        />

        {errors.urcCode && (
          <p className="text-red-500 text-sm mb-3">{errors.urcCode}</p>
        )}

        {/* Query */}
        <label className="flex items-center font-medium">
          Query
          <InfoButton text="Enter your query (max 300 characters)" />
        </label>

        <textarea
          name="query"
          value={formData.query}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          rows="4"
        />

        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span className="text-red-500">{errors.query}</span>
          <span>
            {formData.query.length}/{maxQueryLength}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;
