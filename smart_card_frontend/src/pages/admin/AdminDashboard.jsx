import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [responded, setResponded] = useState([]);

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [responseText, setResponseText] = useState("");

  const [pendingPage, setPendingPage] = useState(1);
  const [respondedPage, setRespondedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pendingSearch, setPendingSearch] = useState("");
  const [respondedSearch, setRespondedSearch] = useState("");

  const [activeTab, setActiveTab] = useState("pending"); // ✅ NEW

  const ITEMS_PER_PAGE = 25;

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const axiosConfig = {
    headers: { Authorization: token },
  };

  const fetchPending = async () => {
    const res = await axios.get(`/api/admin/pending`, axiosConfig);
    setPending(res.data);
  };

  const fetchResponded = async () => {
    const res = await axios.get(`/api/admin/responded`, axiosConfig);
    setResponded(res.data);
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchPending();
    fetchResponded();
  }, []);

  const submitResponse = async () => {
    if (!responseText.trim()) return;

    await axios.post(
      `/api/admin/respond`,
      {
        id: selectedQuery.id,
        response: responseText,
      },
      axiosConfig,
    );

    setSelectedQuery(null);
    setResponseText("");
    fetchPending();
    fetchResponded();
  };

  /* SEARCH + PAGINATION */

  const filteredPending = useMemo(() => {
    return pending.filter((q) =>
      q.query_number.toString().includes(pendingSearch),
    );
  }, [pending, pendingSearch]);

  const filteredResponded = useMemo(() => {
    return responded.filter((q) =>
      q.query_number.toString().includes(respondedSearch),
    );
  }, [responded, respondedSearch]);

  const paginatedPending = useMemo(() => {
    const start = (pendingPage - 1) * itemsPerPage;
    return filteredPending.slice(start, start + itemsPerPage);
  }, [filteredPending, pendingPage, itemsPerPage]);

  const paginatedResponded = useMemo(() => {
    const start = (respondedPage - 1) * itemsPerPage;
    return filteredResponded.slice(start, start + itemsPerPage);
  }, [filteredResponded, respondedPage, itemsPerPage]);

  const totalPendingPages = Math.ceil(filteredPending.length / itemsPerPage);
  const totalRespondedPages = Math.ceil(
    filteredResponded.length / itemsPerPage,
  );
 return (
  <>
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">

      {/* ✅ TABS */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 sm:px-6 py-2 rounded-full font-medium ${
            activeTab === "pending"
              ? "bg-yellow-500 text-white shadow-md"
              : "bg-white/70 text-gray-700"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setActiveTab("responded")}
          className={`px-4 sm:px-6 py-2 rounded-full font-medium ${
            activeTab === "responded"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white/70 text-gray-700"
          }`}
        >
          Responded
        </button>
      </div>

      {/* ================= PENDING ================= */}
      {activeTab === "pending" && (
        <div className="bg-white/90 backdrop-blur-md border shadow-xl rounded-xl p-4 sm:p-6">

          <h2 className="font-semibold mb-4 text-yellow-600">
            Pending Responses
          </h2>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-3">
            <span className="text-sm text-gray-600">
              Total: {filteredPending.length}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-sm">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPendingPage(1);
                }}
                className="border px-2 py-1 rounded"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search by Query ID"
            value={pendingSearch}
            onChange={(e) => {
              setPendingSearch(e.target.value);
              setPendingPage(1);
            }}
            className="border p-2 w-full mb-3 rounded"
          />

          {/* DESKTOP TABLE */}
          <div className="hidden md:grid grid-cols-4 gap-4 font-semibold text-sm bg-gray-100 p-3 rounded mb-2">
            <span>Application ID</span>
            <span>Query ID</span>
            <span>Date</span>
            <span className="text-center">Action</span>
          </div>

          {paginatedPending.map((query) => (
            <React.Fragment key={query.id}>

              {/* DESKTOP */}
              <div className="hidden md:grid grid-cols-4 gap-4 items-center border p-3 mb-2 rounded">
                <span>{query.application_id}</span>
                <span>{query.query_number}</span>
                <span>{new Date(query.created_at).toLocaleDateString()}</span>
                <button
                  onClick={() => setSelectedQuery(query)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Reply
                </button>
              </div>

              {/* MOBILE CARD */}
              <div className="md:hidden border rounded p-3 mb-3 bg-white shadow-sm">
                <p><b>App ID:</b> {query.application_id}</p>
                <p><b>Query ID:</b> {query.query_number}</p>
                <p><b>Date:</b> {new Date(query.created_at).toLocaleDateString()}</p>

                <button
                  onClick={() => setSelectedQuery(query)}
                  className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
                >
                  Reply
                </button>
              </div>

            </React.Fragment>
          ))}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <button
              disabled={pendingPage === 1}
              onClick={() => setPendingPage(pendingPage - 1)}
              className="px-3 py-1 border rounded w-full sm:w-auto"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {pendingPage} of {totalPendingPages || 1}
            </span>

            <button
              disabled={pendingPage === totalPendingPages}
              onClick={() => setPendingPage(pendingPage + 1)}
              className="px-3 py-1 border rounded w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ================= RESPONDED ================= */}
      {activeTab === "responded" && (
        <div className="bg-white/90 backdrop-blur-md border shadow-xl rounded-xl p-4 sm:p-6">

          <h2 className="font-semibold mb-4 text-green-600">
            Responded Queries
          </h2>

          <input
            type="text"
            placeholder="Search by Query ID"
            value={respondedSearch}
            onChange={(e) => {
              setRespondedSearch(e.target.value);
              setRespondedPage(1);
            }}
            className="border p-2 w-full mb-3 rounded"
          />

          {paginatedResponded.map((query) => (
            <div key={query.id} className="border rounded p-3 mb-3 bg-white shadow-sm">
              <p><b>App ID:</b> {query.application_id}</p>
              <p><b>Query ID:</b> {query.query_number}</p>
              <p><b>Submitted:</b> {new Date(query.created_at).toLocaleDateString()}</p>
              <p><b>Replied:</b> {new Date(query.responded_at).toLocaleDateString()}</p>

              <button
                onClick={() => setSelectedQuery(query)}
                className="mt-2 w-full bg-gray-700 text-white py-1 rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* MODAL */}
    {selectedQuery && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center px-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md">

          <h2 className="text-lg font-semibold mb-3">Query Details</h2>

          <p><b>Application ID:</b> {selectedQuery.application_id}</p>
          <p><b>Query ID:</b> {selectedQuery.query_number}</p>
          <p><b>Query:</b> {selectedQuery.query_text}</p>

          {selectedQuery.admin_response ? (
            <div className="bg-green-50 p-3 rounded mt-3">
              {selectedQuery.admin_response}
            </div>
          ) : (
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="border w-full p-2 mt-3 rounded"
              rows="4"
            />
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button
              onClick={() => setSelectedQuery(null)}
              className="border px-3 py-1 rounded w-full sm:w-auto"
            >
              Close
            </button>

            {!selectedQuery.admin_response && (
              <button
                onClick={submitResponse}
                className="bg-blue-600 text-white px-3 py-1 rounded w-full sm:w-auto"
              >
                Send
              </button>
            )}
          </div>

        </div>
      </div>
    )}
  </>
);
}

export default AdminDashboard;
