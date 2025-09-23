export default function MapStub({ markers = [] }) {
  return (
    <div className="map-stub">
      {/* Simple stub. Swap for Leaflet/Mapbox later. */}
      <div className="map-watermark">[ Map Placeholder ]</div>
      {markers.slice(0, 30).map((m, i) => (
        <div
          key={i}
          className="pin"
          style={{
            left: `${10 + ((i * 7) % 80)}%`,
            top: `${15 + ((i * 9) % 70)}%`,
          }}
          title={m.name}
        />
      ))}
    </div>
  );
}
