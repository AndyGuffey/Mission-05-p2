import { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import "../styles/Map.css";

/**
 * Libraries array defined outside component to prevent performance warning
 * from LoadScript component re-rendering with new array references
 */
const libraries = ["marker"];

// Map container dimensions
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default map center coordinates (Auckland)
const defaultCenter = {
  lat: -36.8509,
  lng: 174.7645,
};

/**
 * Map Component
 *
 * Displays Z Energy stations on an interactive Google Map with custom markers and clustering
 *
 * @param {Array} stations - Array of Z stations from the database
 * @returns {JSX.Element} Google Map with station markers
 */
export default function Map({ stations = [] }) {
  // State and refs for map, markers and clustering
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const markerClustererRef = useRef(null);

  // Environment variables for API credentials
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  /**
   * Handles initial map load
   * @param {Object} map - Google Maps instance
   */
  const onLoad = (map) => {
    mapRef.current = map;
    setMap(map);

    // Create markers if station data is available
    if (stations.length > 0) {
      createMarkers(map);
    }
  };

  /**
   * Creates custom markers for each station and sets up clustering
   * @param {Object} mapInstance - Google Maps instance
   */
  const createMarkers = (mapInstance) => {
    if (!mapInstance) return;

    // Clean up existing markers and clusterer
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });

    markersRef.current = [];

    // Create advanced markers for each station
    const newMarkers = stations.map((station) => {
      // Extract coordinates from GeoJSON format
      const position = {
        lat: station.location.coordinates[1], // Latitude is second in GeoJSON
        lng: station.location.coordinates[0], // Longitude is first in GeoJSON
      };

      // Create a custom marker element container
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";

      // Create SVG marker icon
      const markerImage = document.createElement("img");
      markerImage.src = "/markers/marker-logo-Size=S.svg";
      markerImage.className = "marker-icon";
      markerImage.alt = station.name;

      // Debugging listeners for marker image loading
      markerImage.onload = () =>
        console.log("Marker image loaded successfully");
      markerImage.onerror = (e) =>
        console.error("Error loading marker image:", e);

      // Create hover label showing station name
      const markerLabel = document.createElement("div");
      markerLabel.className = "marker-label";
      markerLabel.textContent = station.name;

      // Assemble marker elements
      markerElement.appendChild(markerImage);
      markerElement.appendChild(markerLabel);

      // Create Google's AdvancedMarkerElement with our custom HTML content
      const advancedMarker =
        new window.google.maps.marker.AdvancedMarkerElement({
          position,
          map: mapInstance,
          content: markerElement,
          title: station.name,
        });

      // Add click handler for future interactivity
      advancedMarker.addListener("click", () => {
        console.log("Clicked on:", station.name);
        // Future enhancement: Show station details in sidebar or modal
      });

      return advancedMarker;
    });

    // Save reference to markers for later cleanup
    markersRef.current = newMarkers;

    // Set up marker clustering if we have markers
    if (newMarkers.length > 0) {
      markerClustererRef.current = new MarkerClusterer({
        markers: newMarkers,
        map: mapInstance,
        renderer: {
          /**
           * Custom renderer for marker clusters
           * @param {Object} params - Contains count of markers and position
           * @returns {Object} Custom AdvancedMarkerElement for the cluster
           */
          render: ({ count, position }) => {
            // Create custom cluster element with Z Energy styling
            const clusterElement = document.createElement("div");
            clusterElement.className = "custom-cluster";

            const clusterCircle = document.createElement("div");
            clusterCircle.className = "cluster-circle";

            const clusterCount = document.createElement("div");
            clusterCount.className = "cluster-count";
            clusterCount.textContent = count;

            clusterElement.appendChild(clusterCircle);
            clusterCircle.appendChild(clusterCount);

            // Return a new advanced marker for the cluster
            return new window.google.maps.marker.AdvancedMarkerElement({
              position,
              content: clusterElement,
            });
          },
        },
      });
    }
  };

  /**
   * Effect hook to update markers when stations data changes
   * or when map instance is initialized
   */
  useEffect(() => {
    if (map && stations.length > 0) {
      createMarkers(map);
    }
  }, [stations, map]);

  /**
   * Handles cleanup when map component unmounts
   */
  const onUnmount = () => {
    // Clean up markers and references
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });

    mapRef.current = null;
    setMap(null);
  };

  return (
    <div className="station-map-container">
      {/* LoadScript loads the Google Maps JavaScript API */}
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        {/* GoogleMap component renders the actual map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapId: mapId, // Required for Advanced Markers
          }}
        >
          {/* Markers are created imperatively in createMarkers function */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
