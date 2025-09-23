import { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// Define libraries array outside the component to prevent reloading
const libraries = ["marker"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: -36.8509,
  lng: 174.7645,
};

export default function Map({ stations = [] }) {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const markerClustererRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID; // Add this to your .env file
  //   console.log("Map ID:", mapId); // Check if this is defined for debugging

  const onLoad = (map) => {
    mapRef.current = map;
    setMap(map);

    if (stations.length > 0) {
      createMarkers(map);
    }
  };

  // Create markers when stations or map changes
  const createMarkers = (mapInstance) => {
    if (!mapInstance) return;

    // Clear previous markers and clusterer
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });

    markersRef.current = [];

    // Create advanced markers
    const newMarkers = stations.map((station) => {
      const position = {
        lat: station.location.coordinates[1],
        lng: station.location.coordinates[0],
      };

      // We need to use the JS API directly for advanced markers
      const advancedMarker =
        new window.google.maps.marker.AdvancedMarkerElement({
          position,
          map: mapInstance,
          title: station.name,
        });

      // You can add click listeners directly
      advancedMarker.addListener("click", () => {
        console.log("Clicked on:", station.name);
        // You could open an info window or highlight the station in the sidebar
      });

      return advancedMarker;
    });

    markersRef.current = newMarkers;

    // Create a new marker clusterer if we have markers
    if (newMarkers.length > 0) {
      markerClustererRef.current = new MarkerClusterer({
        markers: newMarkers,
        map: mapInstance,
      });
    }
  };

  // Update markers when stations change
  useEffect(() => {
    if (map && stations.length > 0) {
      createMarkers(map);
    }
  }, [stations, map]);

  const onUnmount = () => {
    // Clean up markers
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
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapId: mapId,
          }}
        >
          {/* Markers are created imperatively in useEffect */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
