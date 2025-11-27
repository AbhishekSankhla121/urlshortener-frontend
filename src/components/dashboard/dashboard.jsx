import { useEffect, useState } from "react";
import "./Dashboard.css";
import { Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const BASE_API = process.env.REACT_APP_BASE_URL|| "http://localhost:5000/api";

  // Fetch links
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_API}/links`);
      const json = await res.json();

      if (!json.success) throw new Error("API error");

      setLinks(json.data);
      setFiltered(json.data);
      setError("");
    } catch (err) {
      setError("Failed to load links. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);



  // Add new URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!redirectUrl.trim()) {
      setFormError("URL cannot be empty.");
      return;
    }
    setFormError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_API}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "url":redirectUrl }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setRedirectUrl("");
      await fetchLinks();
    } catch (err) {
      setFormError("Could not create short URL.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete link
  const deleteLink = async (id) => {
    await fetch(`${BASE_API}/links/${id}`, { method: "DELETE" });
    fetchLinks();
  };
 const getStats = (id) => {
    
    navigate(`/stats/${id}`);

  };
  // Copy to clipboard
  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    alert("copied successfully")
  };

  // Sort table by created date
  const toggleSort = () => {
    const sorted = [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setFiltered(sorted);
  };
const handleredirect=(e,q)=>{
  e.preventDefault();
  window.location.href = q;
}
  return (
    <div className="dashboard-container">
      <h2 className="title">Dashboard</h2>

      {/* Add URL Form */}
      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL to shorten..."
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
        />
        <button disabled={submitting}>
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>
      {formError && <p className="error-message">{formError}</p>}

       <form className="add-form">
      <input
        className="search-box"
        type="text"
        placeholder="Search URLs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
        <button onClick={(e)=> handleredirect(e,query)}>
           redirect
        </button>
  </form>
      {/* States */}
      {loading && <p className="loading">Loading links...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && filtered.length === 0 && (
        <p className="empty">No URLs found.</p>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <table className="links-table">
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Redirect URL</th>
              <th onClick={toggleSort} className="sortable">
                Created At ⯆
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>{item.codeId}</td>

                <td className="truncate">{item.redirectUrl}</td>

                <td>
                  {new Date(item.createdAt).toLocaleDateString()} <br />
                  {new Date(item.createdAt).toLocaleTimeString()}
                </td>

                <td className="actions-col">
                  <button
                    className="copy-btn"
                    onClick={() =>
                      copyText(`http://localhost:5000/${item.codeId}`)
                    }
                  >
                    Copy
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteLink(item.codeId)}
                  >
                    Delete
                  </button>
                                  <button
                    className="stats-btn"
                    onClick={() => getStats(item.codeId)}
                  >
                    stats
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
