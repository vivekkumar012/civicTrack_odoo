// src/pages/ReportIssue.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, MapPin, Crosshair, Camera, Upload } from "lucide-react";

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
  const [selectedLocation, setSelectedLocation] = useState(userLocation || { lat: 21.2514, lng: 81.6296 }); // Default to Raipur
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef(null);

  const API_BASE_URL = "http://localhost:3000/api";

  // Load Leaflet CSS and JS
  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    leafletCSS.crossOrigin = '';
    document.head.appendChild(leafletCSS);

    // Load Leaflet JS
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    leafletJS.crossOrigin = '';
    leafletJS.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(leafletJS);

    return () => {
      // Cleanup function to remove elements if component unmounts
      document.head.removeChild(leafletCSS);
      document.head.removeChild(leafletJS);
    };
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (leafletLoaded && mapRef.current && !map) {
      initializeMap();
    }
  }, [leafletLoaded, map]);

  const initializeMap = () => {
    if (!window.L || !mapRef.current) return;

    try {
      // Initialize the map
      const mapInstance = window.L.map(mapRef.current).setView([selectedLocation.lat, selectedLocation.lng], 15);

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      // Add a marker
      const markerInstance = window.L.marker([selectedLocation.lat, selectedLocation.lng], {
        draggable: true
      }).addTo(mapInstance);

      // Handle marker drag
      markerInstance.on('dragend', function(e) {
        const position = e.target.getLatLng();
        setSelectedLocation({
          lat: position.lat,
          lng: position.lng
        });
      });

      // Handle map click
      mapInstance.on('click', function(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        markerInstance.setLatLng([lat, lng]);
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to load map. Please try refreshing the page.');
    }
  };

  // Update marker position when selectedLocation changes
  useEffect(() => {
    if (marker && selectedLocation && window.L) {
      marker.setLatLng([selectedLocation.lat, selectedLocation.lng]);
    }
    if (map && selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation, marker, map]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(newPos);
          setLoading(false);
        },
        (error) => {
          setError("Unable to get your current location. Please select manually on the map.");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handlePhotoUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentPhotos = newReport.photos;
    
    // Calculate how many more photos we can add (max 3 total)
    const remainingSlots = 3 - currentPhotos.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);
    
    // Combine existing photos with new ones
    const updatedPhotos = [...currentPhotos, ...filesToAdd];
    
    setNewReport({ ...newReport, photos: updatedPhotos });
    
    // Clear the input so the same file can be selected again if needed
    e.target.value = '';
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

    if (!selectedLocation) {
      setError("Please select a location on the map");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", newReport.title);
      formData.append("description", newReport.description);
      formData.append("category", newReport.category);
      formData.append("latitude", selectedLocation.lat);
      formData.append("longitude", selectedLocation.lng);
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
    <div className='bg-gradient-to-r  h-screen w-full'>
        <div className="max-w-4xl mx-auto p-6 bg-[#e0f7f1] text-[#1c3d3a] rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Report a New Issue</h1>

            {error && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)}>
                    <X className="h-4 w-4" />
                </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
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
                    <label className="block text-sm font-medium mb-2">Photos (up to 3)</label>
                    
                    {/* Photo Upload Container */}
                    <div className="flex gap-2 flex-wrap">
                    {/* Uploaded Photos */}
                    {newReport.photos.map((photo, index) => (
                        <div key={index} className="relative">
                        <img
                            src={URL.createObjectURL(photo)}
                            alt="preview"
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                        </div>
                    ))}
                    
                    {/* Add Photo Button (show only if less than 3 photos) */}
                    {newReport.photos.length < 3 && (
                        <label className="w-20 h-20 border-2 border-dashed border-black rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <Camera className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Add Photo</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                        </label>
                    )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                    Click the camera icon to add photos. Maximum 3 photos allowed.
                    </p>
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
                </div>

                {/* Map Section */}
                <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Issue Location *</label>
                    <button
                        onClick={getCurrentLocation}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={loading}
                    >
                        <Crosshair className="h-4 w-4" />
                        {loading ? "Getting Location..." : "Use Current Location"}
                    </button>
                    </div>
                    
                    <div 
                    ref={mapRef}
                    className="w-full h-64 border rounded-lg bg-gray-100"
                    style={{ minHeight: '300px' }}
                    >
                    {/* Fallback content if map fails to load */}
                    {!leafletLoaded && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <MapPin className="h-8 w-8 mx-auto mb-2" />
                            <p>Loading map...</p>
                        </div>
                        </div>
                    )}
                    </div>
                    
                    {selectedLocation && (
                    <div className="mt-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                    Click on the map or drag the marker to select the exact location of the issue
                    </p>
                </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
                <button
                onClick={handleReportSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
                >
                {loading ? "Submitting..." : "Submit Report"}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ReportIssue;