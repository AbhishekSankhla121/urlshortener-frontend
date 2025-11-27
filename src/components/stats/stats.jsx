import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './stats.css'

  const BASE_API = process.env.REACT_APP_BASE_URL|| "http://localhost:5000/api";

export default function Stats() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${BASE_API}/links/${id}`);
      const json = await res.json();

      if (!json.success) throw new Error("API error");

      setData(json);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="stats-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1 className="stats-title">Stats Overview</h1>
      <p className="stats-subtitle">Code: <span>{id}</span></p>

      {loading && <p className="loading">Loading data...</p>}

      {!loading && !data && (
        <p className="error">Failed to load stats.</p>
      )}

      {!loading && data && (
        <div className="stats-card">
          <h2>Total Clicks</h2>
          <p className="total-clicks">{data.data.totalClicks}</p>

          <h3 className="history-title">Visit History</h3>

          {data.data.history.length === 0 ? (
            <p className="empty">No clicks recorded yet.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.data.history.map((item, idx) => (
                  <tr key={item._id}>
                    <td>{idx + 1}</td>
                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
