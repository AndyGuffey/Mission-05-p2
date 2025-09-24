import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, MarkerF } from "@react-google-maps/api";
import "../styles/station-detail.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/api";

// Map container style
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function StationDetail() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // New states for directions feature
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directionDetails, setDirectionDetails] = useState(null);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const mapRef = useRef(null);

  // Google Maps API key
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/stations/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStation(data);
      } catch (e) {
        setErr("Unable to load station.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Get user's current location
  function getUserLocation() {
    if (!station) return;

    setLoadingDirections(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          calculateDirections(userPos);
        },
        (err) => {
          console.error("Error getting location:", err);
          setLoadingDirections(false);
          alert(
            "Could not access your location. Please enable location services."
          );
        }
      );
    } else {
      setLoadingDirections(false);
      alert("Geolocation is not supported by your browser");
    }
  }

  // Calculate directions using Google Maps Directions API
  function calculateDirections(origin) {
    if (!station || !station.lat || !station.lng) {
      setLoadingDirections(false);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: { lat: station.lat, lng: station.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setLoadingDirections(false);

        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          // Extract useful information from the directions result
          const route = result.routes[0].legs[0];
          setDirectionDetails({
            distance: route.distance.text,
            duration: route.duration.text,
            startAddress: route.start_address,
            endAddress: route.end_address,
          });
        } else {
          console.error(`Directions request failed: ${status}`);
          setErr(`Could not calculate directions: ${status}`);
        }
      }
    );
  }

  // Handle map load
  function onMapLoad(map) {
    mapRef.current = map;
  }

  if (loading) return <div className="container">Loading…</div>;
  if (err) return <div className="container">{err}</div>;
  if (!station) return <div className="container">Not found.</div>;

  const fuels = station.fuels ?? station.FuelType ?? [];
  const services = station.services ?? [];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const openStr =
    station.hours || (station.isOpen24Hours ? "Open 24 hours" : "Open");

  // Keep the external Google Maps directions as fallback
  const directionsHref =
    station.lat && station.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          station.address
        )}`;

  return (
    <div className="station-detail">
      <div className="detail-bar">
        <Link className="back" to="/find">
          ← Back
        </Link>
        <h1>{station.name}</h1>
      </div>

      <div className="detail-grid">
        <div className="left">
          <h2 className="address">{station.address}</h2>

          {typeof station.distanceKm === "number" && (
            <p className="muted">{station.distanceKm} km away</p>
          )}

          <div className="hours">
            {days.map((d) => (
              <div className="row" key={d}>
                <span>{d}</span>
                <span>{openStr}</span>
              </div>
            ))}
          </div>

          {/* Replace external link with in-app directions button */}
          {station.lat && station.lng && !directions && (
            <button
              className="btn btn-primary"
              onClick={getUserLocation}
              disabled={loadingDirections}
            >
              {loadingDirections ? "Getting directions..." : "Get Directions"}
            </button>
          )}

          {/* Fallback to external Google Maps */}
          {(!station.lat || !station.lng) && (
            <a
              className="btn btn-primary"
              href={directionsHref}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
          )}

          {/* Show directions details when available */}
          {directions && directionDetails && (
            <div className="directions-info">
              <h3>Directions</h3>
              <div className="directions-details">
                <div className="direction-row">
                  <span>Distance:</span>
                  <span>{directionDetails.distance}</span>
                </div>
                <div className="direction-row">
                  <span>Travel time:</span>
                  <span>{directionDetails.duration}</span>
                </div>
                <div className="direction-row">
                  <span>From:</span>
                  <span className="muted small">
                    {directionDetails.startAddress}
                  </span>
                </div>
                <div className="direction-row">
                  <span>To:</span>
                  <span className="muted small">
                    {directionDetails.endAddress}
                  </span>
                </div>
              </div>

              {/* Option to open in Google Maps */}
              <a
                className="btn btn-secondary"
                href={directionsHref}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
          )}

          <section className="chips">
            <h3>Fuel Types</h3>
            <div className="pills">
              {fuels.length ? (
                fuels.map((f) => (
                  <span className="pill" key={f}>
                    {f}
                  </span>
                ))
              ) : (
                <span className="muted">—</span>
              )}
            </div>
          </section>

          <section className="chips">
            <h3>Services</h3>
            <div className="pills">
              {services.length ? (
                services.map((s) => (
                  <span className="pill" key={s}>
                    {s}
                  </span>
                ))
              ) : (
                <span className="muted">—</span>
              )}
            </div>
          </section>
        </div>

        <div className="right">
          {/* Replace map placeholder with actual Google Map */}
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: station.lat, lng: station.lng }}
              zoom={15}
              onLoad={onMapLoad}
              options={{
                mapId: mapId,
              }}
            >
              {!directions && (
                <MarkerF
                  position={{ lat: station.lat, lng: station.lng }}
                  title={station.name}
                  icon={{
                    url: "/markers/marker-logo-Size=S.svg",
                    scaledSize: new window.google.maps.Size(40, 40),
                    anchor: new window.google.maps.Point(20, 40),
                  }}
                />
              )}

              {/* Render directions if available */}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: "#130F51",
                      strokeWeight: 5,
                      strokeOpacity: 0.7,
                    },
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  );
}
