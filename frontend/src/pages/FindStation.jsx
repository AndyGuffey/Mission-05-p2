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
      <div className="stations-sidebar">
        <h2>Find a Station</h2>
        {loading && <p>Loading stations...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {!loading && !error && stations.length === 0 && (
          <p>No stations found.</p>
        )}
        {!loading && !error && stations.length > 0 && (
          <div className="stations-list">
            {stations.map((station) => (
              <div key={station._id} className="station-card">
                <h3>{station.name}</h3>
                <p>{station.address}</p>
                <p className="hours">
                  {station.isOpen24Hours ? "Open 24 Hours" : "Limited Hours"}
                </p>
                <div className="services">
                  {station.services.map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="map-container">
        {/* Pass the stations data to the Map component */}
        <Map stations={stations} />
      </div>
    </div>
  );
}
