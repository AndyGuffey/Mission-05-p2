import { useState, useEffect } from "react";
import Map from "../components/Map";
import "../styles/FindStation.css"; // Create this CSS file if it doesn't exist

export default function FindStation() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/stations");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched stations:", data); // Debug logging
        setStations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stations:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return (
    <div className="find-station-page">
      {/* DIV for station details */}
      <div className="stations-sidebar">
        {/* Your teammate will add content here later */}
      </div>

      {/* Google Maps container */}
      <div className="map-container">
        {loading ? (
          <div className="loading-overlay">Loading stations...</div>
        ) : error ? (
          <div className="error-overlay">Error: {error}</div>
        ) : (
          <Map stations={stations} />
        )}
      </div>
    </div>
  );
}
