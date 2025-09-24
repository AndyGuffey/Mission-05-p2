import { createContext, useContext, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

// Create a context to track if Maps API is loaded
export const GoogleMapsContext = createContext(null);

// List all libraries you need across the application
const libraries = ["places", "routes", "marker"];

export function GoogleMapsProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        onLoad={() => setIsLoaded(true)}
        loadingElement={<div className="map-loading">Loading maps...</div>}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
}

// Custom hook to use the Google Maps context
export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}
