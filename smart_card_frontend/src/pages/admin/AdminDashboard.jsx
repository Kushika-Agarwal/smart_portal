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
      <div className="w-full max-w-4xl mx-auto p-6">
        {/* ✅ TABS */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === "pending"
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-white/70 text-gray-700"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setActiveTab("responded")}
            className={`px-6 py-2 rounded-full font-medium transition ${
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
          <div className="bg-white/90 backdrop-blur-md border shadow-xl rounded-xl p-6">
            <div>
              <h2 className="font-semibold mb-4 text-yellow-600">
                Pending Responses
              </h2>

              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">
                  Total:{" "}
                  {activeTab === "pending"
                    ? filteredPending.length
                    : filteredResponded.length}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPendingPage(1);
                      setRespondedPage(1);
                    }}
                    className="border px-2 py-1 rounded"
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
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
            {/* title */}
            <div className="grid grid-cols-4 gap-4 font-semibold text-sm bg-gray-100 p-3 rounded mb-2">
              <span>Application ID</span>
              <span>Query ID</span>
              <span>Submitted On</span>
              <span className="text-center">Action</span>
            </div>

            {paginatedPending.map((query) => (
              <div
                key={query.id}
                className="grid grid-cols-4 gap-4 items-center border p-3 mb-2 rounded hover:bg-gray-50"
              >
                <span className="font-medium">{query.application_id}</span>

                <span className="text-gray-600">{query.query_number}</span>

                <span className="text-gray-500">
                  {new Date(query.created_at).toLocaleDateString()}
                </span>

                <button
                  onClick={() => setSelectedQuery(query)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Reply
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button
                disabled={pendingPage === 1}
                onClick={() => setPendingPage(pendingPage - 1)}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>

              <span>
                Page {pendingPage} of {totalPendingPages || 1}
              </span>

              <button
                disabled={pendingPage === totalPendingPages}
                onClick={() => setPendingPage(pendingPage + 1)}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= RESPONDED ================= */}
        {activeTab === "responded" && (
          <div className="bg-white/90 backdrop-blur-md border shadow-xl rounded-xl p-6">
            <div>
              <h2 className="font-semibold mb-4 text-green-600">
                Responded Queries
              </h2>

              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">
                  Total:{" "}
                  {activeTab === "pending"
                    ? filteredPending.length
                    : filteredResponded.length}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPendingPage(1);
                      setRespondedPage(1);
                    }}
                    className="border px-2 py-1 rounded"
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>

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

            <div className="grid grid-cols-5 gap-4 font-semibold text-sm bg-gray-100 p-3 rounded mb-2">
              <span>Application ID</span>
              <span>Query ID</span>
              <span>Submitted On</span>
              <span>Replied On</span>
              <span className="text-center">Action</span>
            </div>

            {paginatedResponded.map((query) => (
              <div
                key={query.id}
                className="grid grid-cols-5 gap-4 items-center border p-3 mb-2 rounded hover:bg-gray-50"
              >
                <span className="font-medium">{query.application_id}</span>

                <span className="text-gray-600">{query.query_number}</span>

                <span className="text-gray-500">
                  {new Date(query.created_at).toLocaleDateString()}
                </span>

                <span className="text-gray-500">
                  {new Date(query.responded_at).toLocaleDateString()}
                </span>

                <button
                  onClick={() => setSelectedQuery(query)}
                  className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
                >
                  View
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button
                disabled={respondedPage === 1}
                onClick={() => setRespondedPage(respondedPage - 1)}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>

              <span>
                Page {respondedPage} of {totalRespondedPages || 1}
              </span>

              <button
                disabled={respondedPage === totalRespondedPages}
                onClick={() => setRespondedPage(respondedPage + 1)}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[420px]">
            <h2 className="text-lg font-semibold mb-3">Query Details</h2>

            <p className="text-sm mb-2">
              <strong>Application ID:</strong> {selectedQuery.application_id}
            </p>

            <p className="text-sm mb-2">
              <strong>Query ID:</strong> {selectedQuery.query_number}
            </p>

            <p className="text-sm mb-2">
              <strong>Submitted On:</strong>{" "}
              {new Date(selectedQuery.created_at).toLocaleString()}
            </p>

            {/* Show replied date only if exists */}
            {selectedQuery.responded_at && (
              <p className="text-sm mb-2">
                <strong>Replied On:</strong>{" "}
                {new Date(selectedQuery.responded_at).toLocaleString()}
              </p>
            )}

            <p className="text-sm mb-3">
              <strong>Query:</strong> {selectedQuery.query_text}
            </p>

            {/* ✅ If response exists → VIEW MODE */}
            {selectedQuery.admin_response ? (
              <div className="bg-green-50 border border-green-200 p-3 rounded text-sm mb-3">
                <p className="font-semibold text-green-700 mb-1">Response:</p>
                <p className="text-gray-700">{selectedQuery.admin_response}</p>
              </div>
            ) : (
              /* Else → show textarea */
              <textarea
                placeholder="Write response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="border w-full p-2 mb-3 rounded"
                rows="4"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedQuery(null)}
                className="px-3 py-1 border rounded"
              >
                Close
              </button>

              {/* Show button only in reply mode */}
              {!selectedQuery.response && (
                <button
                  onClick={submitResponse}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Send Response
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
