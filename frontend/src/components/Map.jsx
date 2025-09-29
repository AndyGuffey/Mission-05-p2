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
export default function Map({
  stations = [],
  activeFuelFilter = "",
  onFuelFilterChange = () => {},
}) {
  // State and refs for map, markers and clustering
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const markerClustererRef = useRef(null);
  const filterButtonsRef = useRef(null);
  const filterButtonsAddedRef = useRef(false);
  const navigate = useNavigate();

  // Environment variables for API credentials
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  /**
   * Creates a filter button element with proper styling and event handling
   */
  const createFilterButton = useCallback(
    (fuelType, label, isActive) => {
      const button = document.createElement("button");
      button.className = `filter-btn ${isActive ? "active" : ""}`;
      button.setAttribute("data-fuel", fuelType);
      button.textContent = label;
      button.addEventListener("click", () => {
        // Call the filter change handler with empty string for 'all'
        onFuelFilterChange(fuelType === "all" ? "" : fuelType);
      });
      return button;
    },
    [onFuelFilterChange]
  );

  /**
   * Adds filter buttons to the map as custom controls
   */
  const addFilterButtonsToMap = useCallback(
    (mapInstance) => {
      // Skip if no map or buttons already added
      if (!mapInstance || filterButtonsAddedRef.current) return;

      console.log("Adding filter buttons to map");

      // Create container for filter buttons
      const filterButtonsDiv = document.createElement("div");
      filterButtonsDiv.className = "map-filters";
      filterButtonsRef.current = filterButtonsDiv;

      // Create filter buttons
      const allBtn = createFilterButton(
        "all",
        "All Fuels",
        activeFuelFilter === ""
      );
      const z91Btn = createFilterButton(
        "91",
        "Z91 Unleaded",
        activeFuelFilter === "91"
      );
      const z95Btn = createFilterButton(
        "95",
        "ZX Premium",
        activeFuelFilter === "95"
      );
      const dieselBtn = createFilterButton(
        "Diesel",
        "Z Diesel",
        activeFuelFilter === "Diesel"
      );

      // Add buttons to container
      filterButtonsDiv.appendChild(allBtn);
      filterButtonsDiv.appendChild(z91Btn);
      filterButtonsDiv.appendChild(z95Btn);
      filterButtonsDiv.appendChild(dieselBtn);

      // Add container to map controls
      mapInstance.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
        filterButtonsDiv
      );

      // Mark that buttons have been added
      filterButtonsAddedRef.current = true;
    },
    [createFilterButton, activeFuelFilter]
  );

  /**
   * Creates custom HTML markers for each station
   * Uses Google's AdvancedMarkerElement for better performance
   */
  const createMarkers = useCallback(
    (mapInstance) => {
      // Clean up existing markers
      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
      }

      markersRef.current.forEach((marker) => {
        marker.map = null;
      });

      markersRef.current = [];

      if (!window.google || !window.google.maps || !window.google.maps.marker) {
        console.error("Google Maps API not fully loaded");
        return;
      }

      const advancedMarkers = [];

      stations.forEach((station) => {
        if (!station.lat || !station.lng) {
          console.warn("Station missing coordinates:", station);
          return;
        }

        // Create a custom marker element container
        const markerElement = document.createElement("div");
        markerElement.className = "custom-marker";

        // Create SVG marker icon
        const markerImage = document.createElement("img");
        markerImage.src = "/markers/marker-logo-Size=S.svg";
        markerImage.className = "marker-icon";
        markerImage.alt = station.name;

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
            position: { lat: station.lat, lng: station.lng },
            content: markerElement,
            title: station.name,
          });

        // Add click handler to navigate to station detail
        advancedMarker.addListener("click", () => {
          navigate(`/stations/${station.id}`);
        });

        advancedMarkers.push(advancedMarker);
        markersRef.current.push(advancedMarker);
      });

      // Create a marker clusterer to group nearby markers
      if (advancedMarkers.length > 0) {
        const clusterer = new MarkerClusterer({
          map: mapInstance,
          markers: advancedMarkers,
          renderer: {
            render: ({ count, position }) => {
              // Create custom cluster marker
              const clusterElement = document.createElement("div");
              clusterElement.className = "custom-cluster";

              const circleElement = document.createElement("div");
              circleElement.className = "cluster-circle";

              const countElement = document.createElement("div");
              countElement.className = "cluster-count";
              countElement.textContent = count;

              circleElement.appendChild(countElement);
              clusterElement.appendChild(circleElement);

              return new window.google.maps.marker.AdvancedMarkerElement({
                position,
                content: clusterElement,
              });
            },
          },
        });

        markerClustererRef.current = clusterer;
      }
    },
    [stations, navigate]
  );

  /**
   * Handles initial map load
   * @param {Object} map - Google Maps instance
   */
  const onLoad = useCallback(
    (map) => {
      console.log("Map loaded");
      mapRef.current = map;
      setMap(map);

      // Add filter buttons to map
      addFilterButtonsToMap(map);

      // Create markers if station data is available
      if (stations.length > 0) {
        createMarkers(map);
      }
    },
    [addFilterButtonsToMap, createMarkers, stations]
  );

  /**
   * Handles cleanup when map component unmounts
   */
  const onUnmount = useCallback(() => {
    console.log("Map unmounting");

    // Clean up markers and references
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });

    // Reset the flag so buttons can be added again if component remounts
    filterButtonsAddedRef.current = false;

    mapRef.current = null;
    filterButtonsRef.current = null;
    setMap(null);
  }, []);

  // Update markers when stations data changes
  useEffect(() => {
    if (map && stations.length > 0) {
      createMarkers(map);
    }
  }, [stations, map, createMarkers]);

  // Update active state of filter buttons when filter changes
  useEffect(() => {
    if (!filterButtonsRef.current) return;

    const buttons = filterButtonsRef.current.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
      const fuelType = btn.getAttribute("data-fuel");
      const isActive =
        (fuelType === "all" && activeFuelFilter === "") ||
        (fuelType !== "all" && fuelType === activeFuelFilter);

      if (isActive) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }, [activeFuelFilter]);

  return (
    <div className="station-map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapId: mapId, // Required for Advanced Markers
          // Add these options to remove UI controls:
          mapTypeControl: false, // Remove the Map/Satellite selector
          streetViewControl: false, // Remove Street View
          fullscreenControl: false, // Remove fullscreen button
          zoomControlOptions: {
            // Move zoom controls away from top left
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        }}
      >
        {/* Markers are created imperatively in createMarkers function */}
      </GoogleMap>
    </div>
  );
}
