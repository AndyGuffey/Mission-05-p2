import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/station-detail.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/api";

export default function StationDetail() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
  const directionsHref =
    station.lat && station.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          station.address
        )}`;

  return (
    <div className="station-detail">
      <div className="detail-bar">
        <Link className="back" to="/find-station">
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

          <a
            className="btn btn-primary"
            href={directionsHref}
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>

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
          <div className="map-placeholder">[ Map Placeholder ]</div>
        </div>
      </div>
    </div>
  );
}
