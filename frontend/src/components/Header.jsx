import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Filter,
  Flag,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Camera,
  User,
  Settings,
  Bell,
  Search,
  X,
  Upload,
  Trash2,
  Edit,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import IssuesMap from "./Issuesmap";
import generateMockIssues from "../Pages/generateMock";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentView, setCurrentView] = useState("list");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    distance: "5",
  });

  const [userLocation, setUserLocation] = useState({
    lat: 21.2514,
    lng: 81.6296,
  }); // Raipur coordinates
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    category: "",
    photos: [],
    isAnonymous: false,
  });

  //   // Mock data for issues
  // const [issues, setIssues] = useState([
  //   {
  //     id: 1,
  //     title: 'Large pothole on Main Street',
  //     description: 'Deep pothole causing traffic issues near the market area',
  //     category: 'Roads',
  //     status: 'Reported',
  //     location: { lat: 21.2504, lng: 81.6286 },
  //     address: 'Main Street, Raipur',
  //     reportedBy: 'Anonymous',
  //     reportedAt: '2025-08-01T10:30:00Z',
  //     photos: ['https://via.placeholder.com/300x200?text=Pothole'],
  //     distance: 1.2,
  //     statusHistory: [
  //       { status: 'Reported', timestamp: '2025-08-01T10:30:00Z', note: 'Issue reported by citizen' }
  //     ],
  //     flagCount: 0
  //   },
  //   {
  //     id: 2,
  //     title: 'Broken streetlight',
  //     description: 'Street light not working for past 3 days',
  //     category: 'Lighting',
  //     status: 'In Progress',
  //     location: { lat: 21.2524, lng: 81.6306 },
  //     address: 'Park Road, Raipur',
  //     reportedBy: 'Rajesh Kumar',
  //     reportedAt: '2025-07-30T14:20:00Z',
  //     photos: ['https://via.placeholder.com/300x200?text=Broken+Light'],
  //     distance: 2.1,
  //     statusHistory: [
  //       { status: 'Reported', timestamp: '2025-07-30T14:20:00Z', note: 'Issue reported by citizen' },
  //       { status: 'In Progress', timestamp: '2025-08-01T09:15:00Z', note: 'Work order assigned to maintenance team' }
  //     ],
  //     flagCount: 0
  //   },
  //   {
  //     id: 3,
  //     title: 'Water leak on Gandhi Road',
  //     description: 'Major water leak causing road flooding',
  //     category: 'Water Supply',
  //     status: 'Resolved',
  //     location: { lat: 21.2494, lng: 81.6276 },
  //     address: 'Gandhi Road, Raipur',
  //     reportedBy: 'Priya Sharma',
  //     reportedAt: '2025-07-28T08:45:00Z',
  //     photos: ['https://via.placeholder.com/300x200?text=Water+Leak'],
  //     distance: 2.8,
  //     statusHistory: [
  //       { status: 'Reported', timestamp: '2025-07-28T08:45:00Z', note: 'Issue reported by citizen' },
  //       { status: 'In Progress', timestamp: '2025-07-29T11:30:00Z', note: 'Repair team dispatched' },
  //       { status: 'Resolved', timestamp: '2025-07-30T16:20:00Z', note: 'Leak repaired and road cleaned' }
  //     ],
  //     flagCount: 0
  //   }
  // ]);

  //DATA STATE
 
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
  // Use mock data if no real data is available
  if (issues.length === 0) {
    setIssues(generateMockIssues());
  }
}, []);

const [useMockData, setUseMockData] = useState(true); // Set to false for production
useEffect(() => {
  if (useMockData) {
    setIssues(generateMockIssues());
  } else {
    fetchIssues(); // Your real API call
  }
}, [useMockData]);

  const categories = [
    "Roads",
    "Lighting",
    "Water Supply",
    "Cleanliness",
    "Public Safety",
    "Obstructions",
  ];
  const statusColors = {
    Reported: "bg-red-100 text-red-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Resolved: "bg-green-100 text-green-800",
  };

  const statusIcons = {
    Reported: AlertTriangle,
    "In Progress": Clock,
    Resolved: CheckCircle,
  };

  // const token = localStorage.getItem("token");
  // if(token) {
  //   setIsAuthenticated(true);
  // }

  const API_BASE_URL = "http://localhost:3000/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    //const userData = localStorage.getItem("user");

    if (token) {
      //setUser(JSON.parse(userData));
      setIsAuthenticated(true);
      fetchIssues();
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successfully");
    navigate("/login");
  };

  // Fetch Issues from Backend
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIssues(data.issues || data); // Handle different response structures
      } else {
        setError("Failed to fetch issues");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create New Issue
  const handleReportSubmit = async () => {
    if (!newReport.title || !newReport.category) {
      setError("Please fill in required fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", newReport.title);
      formData.append("description", newReport.description);
      formData.append("category", newReport.category);
      formData.append("latitude", userLocation.lat);
      formData.append("longitude", userLocation.lng);
      formData.append("isAnonymous", newReport.isAnonymous);

      // Add photos
      newReport.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append("photos", photo);
        }
      });

      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newIssue = await response.json();
        setIssues([newIssue, ...issues]);
        setNewReport({
          title: "",
          description: "",
          category: "",
          photos: [],
          isAnonymous: false,
        });
        setShowReportModal(false);
        setError(null);
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

  // Update Issue Status (Admin only)
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchIssues(); // Refresh issues
      } else {
        setError("Failed to update issue status");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  // Flag Issue
  const flagIssue = async (issueId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}/flag`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchIssues(); // Refresh issues
      } else {
        setError("Failed to flag issue");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  // Filter issues based on current filters
  const filteredIssues = issues.filter((issue) => {
    if (filters.status !== "all" && issue.status !== filters.status)
      return false;
    if (filters.category !== "all" && issue.category !== filters.category)
      return false;
    // Add distance filtering logic based on your backend data structure
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">CivicTrack</h1>
              </div>
              <span className="text-sm text-gray-500">
                Raipur, Chhattisgarh
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Settings className="h-5 w-5" />
              </button>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-400" />
                  <Link
                    to={"/login"}
                    className="text-sm font-medium text-gray-700"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView("list")}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentView === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setCurrentView("map")}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentView === "map"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Map View
            </button>
          </div>

          {/* <button
            onClick={() => setShowReportModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Report Issue</span>
          </button> */}

          {isAuthenticated && (
            <Link
              to="/report"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Report Issue</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filters.distance}
              onChange={(e) =>
                setFilters({ ...filters, distance: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="1">Within 1 km</option>
              <option value="3">Within 3 km</option>
              <option value="5">Within 5 km</option>
            </select>

            <button
              onClick={fetchIssues}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200"
            >
              Refresh
            </button>

            <span className="text-sm text-gray-500">
              {filteredIssues.length} issues found
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading issues...</p>
          </div>
        )}

        {/* Main Content */}
        {currentView === "list" ? (
          <div className="grid gap-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => {
                const StatusIcon = statusIcons[issue.status] || AlertTriangle;
                return (
                  <div
                    key={issue.id || issue._id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {issue.title}
                            </h3>
                            <button
                              onClick={() => flagIssue(issue.id || issue._id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Flag as inappropriate"
                            >
                              <Flag className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {issue.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              📍{" "}
                              {issue.address ||
                                `${issue.latitude}, ${issue.longitude}`}
                            </span>
                            <span>
                              👤{" "}
                              {issue.reportedBy ||
                                issue.userId?.name ||
                                "Anonymous"}
                            </span>
                            <span>
                              📅{" "}
                              {new Date(
                                issue.createdAt || issue.reportedAt
                              ).toLocaleDateString()}
                            </span>
                            {issue.distance && (
                              <span>
                                📏 {issue.distance.toFixed(1)} km away
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[issue.status] ||
                              statusColors["Reported"]
                            }`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {issue.status}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                            {issue.category}
                          </span>
                          {issue.flagCount > 0 && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              🚩 {issue.flagCount}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {user?.role === "admin" && (
                            <div className="flex space-x-1">
                              {issue.status !== "In Progress" && (
                                <button
                                  onClick={() =>
                                    updateIssueStatus(
                                      issue.id || issue._id,
                                      "In Progress"
                                    )
                                  }
                                  className="text-yellow-600 hover:text-yellow-800 text-xs px-2 py-1 bg-yellow-50 rounded"
                                >
                                  Mark In Progress
                                </button>
                              )}
                              {issue.status !== "Resolved" && (
                                <button
                                  onClick={() =>
                                    updateIssueStatus(
                                      issue.id || issue._id,
                                      "Resolved"
                                    )
                                  }
                                  className="text-green-600 hover:text-green-800 text-xs px-2 py-1 bg-green-50 rounded"
                                >
                                  Mark Resolved
                                </button>
                              )}
                            </div>
                          )}
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>

                      {issue.photos && issue.photos.length > 0 && (
                        <div className="mt-4 flex space-x-2">
                          {issue.photos.slice(0, 3).map((photo, index) => (
                            <img
                              key={index}
                              src={
                                typeof photo === "string"
                                  ? photo
                                  : URL.createObjectURL(photo)
                              }
                              alt={`Issue photo ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Issues Found
                </h3>
                <p className="text-gray-500">
                  No issues match your current filters, or no issues have been
                  reported yet.
                </p>
              </div>
              // <IssuesMap
              //   issues={filteredIssues}
              //   userLocation={userLocation}
              //   onIssueClick={setSelectedIssue}
              //   filters={filters}
              // />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Map View
              </h3>
              <p className="text-gray-500">
                Interactive map showing all issues within your radius
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Map integration would be implemented with your preferred mapping
                service
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Report New Issue</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) =>
                    setNewReport({ ...newReport, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newReport.category}
                  onChange={(e) =>
                    setNewReport({ ...newReport, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) =>
                    setNewReport({ ...newReport, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                  placeholder="Provide more details about the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (up to 3)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {newReport.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newReport.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              typeof photo === "string"
                                ? photo
                                : URL.createObjectURL(photo)
                            }
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newReport.isAnonymous}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      isAnonymous: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="anonymous"
                  className="ml-2 text-sm text-gray-700"
                >
                  Report anonymously
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReportSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Issue Details</h2>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedIssue.title}
                  </h3>
                  <p className="text-gray-600">{selectedIssue.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2">{selectedIssue.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        statusColors[selectedIssue.status] ||
                        statusColors["Reported"]
                      }`}
                    >
                      {selectedIssue.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2">
                      {selectedIssue.address ||
                        `${selectedIssue.latitude}, ${selectedIssue.longitude}`}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Reported by:
                    </span>
                    <span className="ml-2">
                      {selectedIssue.reportedBy ||
                        selectedIssue.userId?.name ||
                        "Anonymous"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Reported on:
                    </span>
                    <span className="ml-2">
                      {new Date(
                        selectedIssue.createdAt || selectedIssue.reportedAt
                      ).toLocaleString()}
                    </span>
                  </div>
                  {selectedIssue.flagCount > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Flags:</span>
                      <span className="ml-2 text-red-600">
                        {selectedIssue.flagCount}
                      </span>
                    </div>
                  )}
                </div>

                {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Photos</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedIssue.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={
                            typeof photo === "string"
                              ? photo
                              : URL.createObjectURL(photo)
                          }
                          alt={`Issue photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-75"
                          onClick={() =>
                            window.open(
                              typeof photo === "string"
                                ? photo
                                : URL.createObjectURL(photo),
                              "_blank"
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedIssue.statusHistory &&
                  selectedIssue.statusHistory.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">
                        Status History
                      </h4>
                      <div className="space-y-3">
                        {selectedIssue.statusHistory.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">
                                  {entry.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    entry.timestamp || entry.createdAt
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {entry.note || entry.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {user?.role === "admin" && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Admin Actions
                    </h4>
                    <div className="flex space-x-2">
                      {selectedIssue.status !== "In Progress" && (
                        <button
                          onClick={() => {
                            updateIssueStatus(
                              selectedIssue.id || selectedIssue._id,
                              "In Progress"
                            );
                            setSelectedIssue(null);
                          }}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {selectedIssue.status !== "Resolved" && (
                        <button
                          onClick={() => {
                            updateIssueStatus(
                              selectedIssue.id || selectedIssue._id,
                              "Resolved"
                            );
                            setSelectedIssue(null);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdminPanel && user?.role === "admin" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Admin Panel</h2>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Total Issues
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {issues.length}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900">
                    Reported
                  </h3>
                  <p className="text-3xl font-bold text-red-600">
                    {issues.filter((i) => i.status === "Reported").length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-900">
                    In Progress
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {issues.filter((i) => i.status === "In Progress").length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900">
                    Resolved
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    {issues.filter((i) => i.status === "Resolved").length}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Flagged Issues</h3>
                {issues.filter((issue) => issue.flagCount > 0).length > 0 ? (
                  issues
                    .filter((issue) => issue.flagCount > 0)
                    .map((issue) => (
                      <div
                        key={issue.id || issue._id}
                        className="border border-red-200 rounded-lg p-4 bg-red-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{issue.title}</h4>
                            <p className="text-sm text-gray-600">
                              {issue.description}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              Flagged {issue.flagCount} time(s)
                            </p>
                            <p className="text-xs text-gray-500">
                              Reported by:{" "}
                              {issue.reportedBy ||
                                issue.userId?.name ||
                                "Anonymous"}{" "}
                              on{" "}
                              {new Date(
                                issue.createdAt || issue.reportedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() => setSelectedIssue(issue)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() =>
                                updateIssueStatus(
                                  issue.id || issue._id,
                                  "Resolved"
                                )
                              }
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Approve & Resolve
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                              Remove Issue
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No flagged issues at the moment
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Category Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const count = issues.filter(
                      (issue) => issue.category === category
                    ).length;
                    return (
                      <div key={category} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-700">
                          {category}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
