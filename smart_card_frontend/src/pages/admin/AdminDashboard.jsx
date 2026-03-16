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

  const [pendingSearch, setPendingSearch] = useState("");
  const [respondedSearch, setRespondedSearch] = useState("");

  const ITEMS_PER_PAGE = 25;

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const axiosConfig = {
    headers: { Authorization: token }
  };

  const fetchPending = async () => {
    const res = await axios.get(
      // "http://localhost:5000/api/admin/pending",
      "http://136.114.126.147:5000/api/admin/pending",
      axiosConfig
    );
    setPending(res.data);
  };

  const fetchResponded = async () => {
    const res = await axios.get(
      // "http://localhost:5000/api/admin/responded",
      "http://136.114.126.147:5000/api/admin/responded",
      axiosConfig
    );
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
      // "http://localhost:5000/api/admin/respond",
      "http://136.114.126.147:5000/api/admin/respond",
      {
        id: selectedQuery.id,
        response: responseText
      },
      axiosConfig
    );

    setSelectedQuery(null);
    setResponseText("");
    fetchPending();
    fetchResponded();
  };

  /* =========================
     SEARCH + PAGINATION
  ========================= */

  const filteredPending = useMemo(() => {
    return pending.filter(q =>
      q.query_number.toString().includes(pendingSearch)
    );
  }, [pending, pendingSearch]);

  const filteredResponded = useMemo(() => {
    return responded.filter(q =>
      q.query_number.toString().includes(respondedSearch)
    );
  }, [responded, respondedSearch]);

  const paginatedPending = useMemo(() => {
    const start = (pendingPage - 1) * ITEMS_PER_PAGE;
    return filteredPending.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPending, pendingPage]);

  const paginatedResponded = useMemo(() => {
    const start = (respondedPage - 1) * ITEMS_PER_PAGE;
    return filteredResponded.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResponded, respondedPage]);

  const totalPendingPages = Math.ceil(filteredPending.length / ITEMS_PER_PAGE);
  const totalRespondedPages = Math.ceil(filteredResponded.length / ITEMS_PER_PAGE);

  return (
<>

    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 p-10">

      {/* ================= PENDING ================= */}
      <div className="bg-white/90 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-6 text-lg">

        <h2 className="font-semibold mb-4 text-yellow-600">
          Pending Responses
        </h2>

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

        {paginatedPending.map(query => (
          <div
            key={query.id}
            className="border p-3 mb-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setSelectedQuery(query)}
          >
            <p className="font-medium">{query.application_id}</p>
            <p className="text-sm text-gray-600">{query.query_number}</p>
          </div>
        ))}

        {/* Pagination */}
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

      {/* ================= RESPONDED ================= */}
      <div className="bg-white/90 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-4">

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

        {paginatedResponded.map(query => (
          <div key={query.id} className="border p-3 mb-2 rounded">
            <p className="font-medium">{query.application_id}</p>
            <p className="text-sm text-gray-600">{query.query_number}</p>
          </div>
        ))}

        {/* Pagination */}
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

    </div>

      {/* Modal */ }
  {
    selectedQuery && (

      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

        <div className="bg-white p-6 rounded-xl shadow-xl w-96">

          <h2 className="text-lg font-semibold mb-3">
            Query Details
          </h2>

          <p className="text-sm mb-2">
            <strong>Application ID:</strong> {selectedQuery.application_id}
          </p>

          <p className="text-sm mb-2">
            <strong>Query ID:</strong> {selectedQuery.query_number}
          </p>

          <p className="text-sm mb-4">
            <strong>Query:</strong> {selectedQuery.query_text}
          </p>

          <textarea
            placeholder="Write response..."
            value={responseText}
            onChange={e => setResponseText(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            rows="4"
          />

          <div className="flex justify-end gap-2">

            <button
              onClick={() => setSelectedQuery(null)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={submitResponse}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Send Response
            </button>

          </div>

        </div>

      </div>

    )
  }
</>

  )
}
  

export default AdminDashboard;