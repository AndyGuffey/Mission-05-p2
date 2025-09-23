import { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import StationCard from "../components/StationCard.jsx";
import MapStub from "../components/MapStub.jsx";
import "../styles/finder.css";

// Use proxy if present, or fall back to full URL
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/api";
const DEV_FALLBACK_NEAR =
  import.meta.env.VITE_DEV_FAKE_COORDS || "-36.8485,174.7633";

export default function FindStation() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ service: "", fuel: "" });
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const debounceRef = useRef();

  // Initial load – get everything
  useEffect(() => {
    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced fetch when query/service/fuel change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchStations();
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters.service, filters.fuel]);

  async function fetchStations(extra = {}) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("query", query.trim());
      if (filters.service) params.set("service", filters.service);
      if (filters.fuel) params.set("fuel", filters.fuel);
      if (extra.near) params.set("near", extra.near);

      const url = params.toString()
        ? `${API_BASE}/stations?${params.toString()}`
        : `${API_BASE}/stations`;

      console.log("[stations] GET", url); // <- sanity check in DevTools

      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Expected JSON, got ${res.status} ${ct}: ${text.slice(0, 120)}`
        );
      }
      const data = await res.json();
      setStations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch stations failed:", e);
      setStations([]);
    } finally {
      setLoading(false);
    }
  }

  // ---- Use my location (robust) ----
  async function useMyLocation() {
    setLocError("");
    // Geolocation only works on https or localhost/127.0.0.1
    const originIsSecure =
      window.isSecureContext ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1";
    if (!originIsSecure) {
      setLocError(
        "Location requires HTTPS or localhost. Open the site on https://… or http://localhost."
      );
      // Optional: dev fallback
      await fetchStations({ near: DEV_FALLBACK_NEAR });
      return;
    }

    if (!("geolocation" in navigator)) {
      setLocError("Geolocation is not available in this browser.");
      await fetchStations({ near: DEV_FALLBACK_NEAR });
      return;
    }

    try {
      // Permission hint (not supported everywhere)
      try {
        const perm = await navigator.permissions?.query({
          name: "geolocation",
        });
        if (perm && perm.state === "denied") {
          setLocError(
            "Location permission denied. Enable it in your browser site settings."
          );
          await fetchStations({ near: DEV_FALLBACK_NEAR });
          return;
        }
      } catch {} // ignore

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        });
      });

      const lat = +pos.coords.latitude.toFixed(6);
      const lng = +pos.coords.longitude.toFixed(6);
      await fetchStations({ near: `${lat},${lng}` });
    } catch (e) {
      console.warn("Geolocation failed:", e);
      setLocError("Could not get your location. Using a default area instead.");
      await fetchStations({ near: DEV_FALLBACK_NEAR }); // dev fallback so the UI still shows nearby-ish data
    }
  }

  function handleApply() {
    clearTimeout(debounceRef.current);
    fetchStations();
  }

  return (
    <div className="finder">
      <div className="finder-header">
        <h1>Find a station</h1>
        <p className="muted">Search by location, services, or fuel type.</p>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onUseLocation={useMyLocation}
        onSearch={handleApply}
      />

      <div className="filter-row">
        <select
          value={filters.service}
          onChange={(e) =>
            setFilters((f) => ({ ...f, service: e.target.value }))
          }
        >
          <option value="">All services</option>
          <option>Car wash</option>
          <option>LPG</option>
          <option>Trailer hire</option>
          <option>EV charging</option>
          <option>Food</option>
          <option>Restroom</option>
          <option>Shop</option>
        </select>
        <select
          value={filters.fuel}
          onChange={(e) => setFilters((f) => ({ ...f, fuel: e.target.value }))}
        >
          <option value="">Fuel type</option>
          <option>91</option>
          <option>95</option>
          <option>98</option>
          <option>Diesel</option>
          <option>EV</option>
        </select>
      </div>

      <div className="results-header">
        <strong>{stations.length}</strong> Stations found
      </div>

      <div className="finder-grid">
        <div className="results-col">
          {loading && <div className="loading">Loading…</div>}
          {!loading &&
            stations.map((s) => <StationCard key={s.id} station={s} />)}
          {!loading && stations.length === 0 && (
            <div className="muted">No stations match.</div>
          )}
        </div>

        <div className="map-col">
          <MapStub markers={stations} />
        </div>
      </div>
    </div>
  );
}
