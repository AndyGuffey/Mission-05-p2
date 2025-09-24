import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useNavigate } from "react-router-dom";
import "../styles/Map.css";

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
 * Compatible with the updated station data structure that uses lat/lng properties
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
  const navigate = useNavigate();

  // Environment variables for API credentials
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  /**
   * Handles initial map load
   * @param {Object} map - Google Maps instance
   */
  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;
      setMap(map);

      // Create markers if station data is available
      if (stations.length > 0) {
        createMarkers(map);
      }
    },
    [stations]
  );

  /**
   * Creates custom markers for each station and sets up clustering
   * Handles the new data structure with direct lat/lng properties
   * @param {Object} mapInstance - Google Maps instance
   */
  const createMarkers = useCallback(
    (mapInstance) => {
      if (!mapInstance) return;

      // Add debugging
      console.log("Creating markers for", stations.length, "stations");

      // Clean up existing markers and clusterer
      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
      }

      markersRef.current.forEach((marker) => {
        marker.map = null;
      });

      markersRef.current = [];

      // Create advanced markers for each station
      // Updated to use new data structure with lat/lng properties
      const newMarkers = stations
        .filter((station) => {
          // Check if station has valid lat/lng coordinates in the new format
          return station.lat !== undefined && station.lng !== undefined;
        })
        .map((station) => {
          // Log for debugging
          console.log("Creating marker for station:", station.name, "at", {
            lat: station.lat,
            lng: station.lng,
          });

          // Extract coordinates from the new format with direct lat/lng properties
          const position = {
            lat: station.lat,
            lng: station.lng,
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
            console.log("Marker image loaded successfully for", station.name);
          markerImage.onerror = (e) =>
            console.error("Error loading marker image:", markerImage.src, e);

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

          // Add click handler to navigate to station details
          advancedMarker.addListener("click", () => {
            console.log("Clicked on:", station.name);
            navigate(`/station/${station.id}`);
          });

          return advancedMarker;
        });

      console.log("Created", newMarkers.length, "markers");

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
    },

    [stations, navigate]
  );

  /**
   * Effect hook to update markers when stations data changes
   * or when map instance is initialized
   */
  useEffect(() => {
    console.log("Map received stations:", stations);

    // Detailed inspection of first station for debugging purposes
    if (stations.length > 0) {
      const firstStation = stations[0];
      console.log("First station details:", {
        name: firstStation.name,
        id: firstStation.id, // Changed from _id to id for new data structure
        keys: Object.keys(firstStation),
        lat: firstStation.lat,
        lng: firstStation.lng,
      });
    }

    if (map && stations.length > 0) {
      createMarkers(map);
    }
  }, [stations, map, createMarkers]);

  /**
   * Handles cleanup when map component unmounts
   */
  const onUnmount = useCallback(() => {
    // Clean up markers and references
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });

    mapRef.current = null;
    setMap(null);
  }, []);

  /**
   * Add filter buttons to the top left corner of the map (Optional)
   * This would filter markers by fuel type if implemented
   */
  const filterButtons = (
    <div className="map-filters">
      {/* These buttons could be implemented to filter by fuel type */}
      {/* 
      <button className="filter-btn active">Z91 Unleaded</button>
      <button className="filter-btn">ZX Premium</button>
      <button className="filter-btn">Z Diesel</button>
      */}
    </div>
  );

  return (
    <div className="station-map-container">
      {/* Optional filter buttons */}
      {/* {filterButtons} */}


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
    </div>
  );
}
