import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, RotateCcw, Eye, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const IssuesMap = ({ issues = [], userLocation, onIssueClick, filters }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapView, setMapView] = useState('satellite');
  const [showUserLocation, setShowUserLocation] = useState(true);

  // Status colors and icons
  const statusConfig = {
    'Reported': { color: '#ef4444', icon: '🚨', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    'In Progress': { color: '#f59e0b', icon: '⏳', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    'Resolved': { color: '#10b981', icon: '✅', bgColor: 'bg-green-100', textColor: 'text-green-800' }
  };

  const categoryIcons = {
    'Roads': '🛣️',
    'Lighting': '💡',
    'Water Supply': '💧',
    'Cleanliness': '🧹',
    'Public Safety': '🛡️',
    'Obstructions': '🚧'
  };

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && issues) {
      updateMarkers();
    }
  }, [issues, filters]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    
    // Initialize map
    const map = L.map(mapRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false
    });

    // Add tile layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri'
    });

    streetLayer.addTo(map);

    // Store layers for switching
    map.tileLayers = {
      street: streetLayer,
      satellite: satelliteLayer
    };

    // Add user location marker
    if (showUserLocation) {
      const userIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
        className: 'user-location-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Your Location</b>');
    }

    mapInstanceRef.current = map;
    setIsLoading(false);
    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Filter issues based on current filters
    const filteredIssues = issues.filter(issue => {
      if (filters.status !== 'all' && issue.status !== filters.status) return false;
      if (filters.category !== 'all' && issue.category !== filters.category) return false;
      return true;
    });

    // Add markers for each issue
    filteredIssues.forEach(issue => {
      const status = issue.status || 'Reported';
      const statusInfo = statusConfig[status];
      const categoryIcon = categoryIcons[issue.category] || '📍';

      // Create custom marker
      const markerIcon = L.divIcon({
        html: `
          <div class="relative group cursor-pointer transform transition-transform hover:scale-110">
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm" 
                 style="background-color: ${statusInfo.color}">
              <span class="text-white font-bold">${categoryIcon}</span>
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent" 
                 style="border-top-color: ${statusInfo.color}"></div>
          </div>
        `,
        className: 'issue-marker',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([issue.latitude || issue.location?.coordinates[1], issue.longitude || issue.location?.coordinates[0]], {
        icon: markerIcon
      });

      // Create popup content
      const popupContent = `
        <div class="min-w-64 p-2">
          <div class="font-semibold text-gray-900 mb-2 text-sm">${issue.title}</div>
          <div class="text-gray-600 text-xs mb-3 line-clamp-2">${issue.description}</div>
          
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}">
              ${statusInfo.icon} ${status}
            </span>
            <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
              ${issue.category}
            </span>
          </div>
          
          <div class="text-xs text-gray-500 space-y-1 mb-3">
            <div>📍 ${issue.address || `${issue.latitude?.toFixed(4)}, ${issue.longitude?.toFixed(4)}`}</div>
            <div>👤 ${issue.reportedBy || issue.userId?.name || 'Anonymous'}</div>
            <div>📅 ${new Date(issue.createdAt || issue.reportedAt).toLocaleDateString()}</div>
            ${issue.distance ? `<div>📏 ${issue.distance.toFixed(1)} km away</div>` : ''}
          </div>
          
          <button 
            onclick="window.handleIssueClick && window.handleIssueClick('${issue.id || issue._id}')"
            class="w-full bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1), { maxZoom: 15 });
    }
  };

  // Expose issue click handler to global scope for popup buttons
  useEffect(() => {
    window.handleIssueClick = (issueId) => {
      const issue = issues.find(i => (i.id || i._id) === issueId);
      if (issue && onIssueClick) {
        onIssueClick(issue);
      }
    };

    return () => {
      delete window.handleIssueClick;
    };
  }, [issues, onIssueClick]);

  const switchMapView = (view) => {
    if (!mapInstanceRef.current || !mapInstanceRef.current.tileLayers) return;

    const map = mapInstanceRef.current;
    
    // Remove current layer
    Object.values(map.tileLayers).forEach(layer => map.removeLayer(layer));
    
    // Add new layer
    if (view === 'satellite') {
      map.tileLayers.satellite.addTo(map);
    } else {
      map.tileLayers.street.addTo(map);
    }
    
    setMapView(view);
  };

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();
  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
    }
  };

  const locateUser = () => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 15);
          
          // Add temporary marker
          const L = window.L;
          const locationIcon = L.divIcon({
            html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-ping"></div>`,
            className: 'current-location-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          
          const tempMarker = L.marker([latitude, longitude], { icon: locationIcon })
            .addTo(map)
            .bindPopup('Current Location')
            .openPopup();
          
          setTimeout(() => map.removeLayer(tempMarker), 3000);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Map</h3>
          <p className="text-gray-500">Initializing interactive map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Map Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Issues Map</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {issues.filter(issue => {
              if (filters.status !== 'all' && issue.status !== filters.status) return false;
              if (filters.category !== 'all' && issue.category !== filters.category) return false;
              return true;
            }).length} issues
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Map View Toggle */}
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => switchMapView('street')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                mapView === 'street' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => switchMapView('satellite')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                mapView === 'satellite' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div ref={mapRef} className="h-96 w-full" />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
          <button
            onClick={zoomIn}
            className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={zoomOut}
            className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={locateUser}
            className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
            title="Find My Location"
          >
            <Navigation className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={resetView}
            className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 z-[1000]">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Status Legend</h4>
          <div className="space-y-1">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: config.color }}
                ></div>
                <span className="text-xs text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>
            Click on markers to view issue details
          </div>
          <div>
            📍 Showing issues within {filters.distance || 5} km radius
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesMap;

// Usage in your main component:
// Replace the map view section with:
/*
{currentView === "map" ? (
  <IssuesMap 
    issues={filteredIssues}
    userLocation={userLocation}
    onIssueClick={setSelectedIssue}
    filters={filters}
  />
) : (
  // Your existing list view code...
)}
*/