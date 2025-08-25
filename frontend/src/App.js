import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [allUrls, setAllUrls] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const fetchUrls = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/all");
      setAllUrls(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/shorten", { longUrl });
      setShortUrl(res.data.shortUrl);
      setLongUrl("");
      if (showAdmin) fetchUrls();
    } catch (err) {
      console.error(err);
      alert("Failed to shorten URL. Make sure backend is running!");
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1500);
  };

  return (
    <div className="app-container">
      <h1 className="app-header">🔗 URL Shortener</h1>

      <form className="url-form" onSubmit={handleSubmit}>
        <input
          className="url-input"
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {shortUrl && (
        <div className="short-url-card">
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
          <button className="copy-btn" onClick={() => copyToClipboard(shortUrl)}>Copy</button>
          {showTooltip && <div className="tooltip">Copied!</div>}
        </div>
      )}

      <button
        className="admin-toggle"
        onClick={() => {
          setShowAdmin(!showAdmin);
          if (!showAdmin) fetchUrls();
        }}
      >
        {showAdmin ? "Hide Admin Panel" : "Show Admin Panel"}
      </button>

      {showAdmin && (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <table>
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Long URL</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {allUrls.map(u => (
                <tr key={u._id}>
                  <td>
                    <a href={`http://localhost:5000/${u.shortCode}`} target="_blank" rel="noreferrer">
                      {u.shortCode}
                    </a>
                  </td>
                  <td>{u.longUrl}</td>
                  <td>{u.visitCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
