// src/pages/ReportIssue.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

const categories = [
  "Roads",
  "Lighting",
  "Water Supply",
  "Cleanliness",
  "Public Safety",
  "Obstructions",
];

const ReportIssue = ({ userLocation, setIssues }) => {
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    category: "",
    photos: [],
    isAnonymous: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:3001/api";

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setNewReport({ ...newReport, photos: files });
  };

  const removePhoto = (index) => {
    const updated = [...newReport.photos];
    updated.splice(index, 1);
    setNewReport({ ...newReport, photos: updated });
  };

  const handleReportSubmit = async () => {
    if (!newReport.title || !newReport.category) {
      setError("Please fill in required fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", newReport.title);
      formData.append("description", newReport.description);
      formData.append("category", newReport.category);
      formData.append("latitude", userLocation.lat);
      formData.append("longitude", userLocation.lng);
      formData.append("isAnonymous", newReport.isAnonymous);

      newReport.photos.forEach((photo) => {
        if (photo instanceof File) formData.append("photos", photo);
      });

      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const created = await response.json();
        if (setIssues) setIssues((prev) => [created, ...prev]);
        setNewReport({ title: "", description: "", category: "", photos: [], isAnonymous: false });
        setError(null);
        window.location.href = "/"; // Redirect to home
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create issue");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Report a New Issue</h1>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            type="text"
            value={newReport.title}
            onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category *</label>
          <select
            value={newReport.category}
            onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={newReport.description}
            onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Photos (up to 3)</label>
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
          <div className="flex gap-2 mt-2">
            {newReport.photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={newReport.isAnonymous}
            onChange={(e) => setNewReport({ ...newReport, isAnonymous: e.target.checked })}
            className="mr-2"
          />
          <label>Report Anonymously</label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleReportSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
