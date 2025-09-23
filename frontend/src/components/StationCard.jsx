// import { Link } from "react-router-dom";

// export default function StationCard({ station }) {
//   const fuels = station.fuels ?? station.FuelType ?? [];
//   return (
//     <div className="station-card">
//       <h3>
//         <Link to={`/station/${station.id}`}>{station.name}</Link>
//       </h3>
//       <p className="muted">{station.address}</p>
//       {typeof station.distanceKm === "number" && (
//         <p className="muted" style={{ marginTop: 4 }}>
//           {station.distanceKm} km away
//         </p>
//       )}
//       <ul className="meta">
//         <li>Open: {station.hours}</li>
//         {station.services?.length > 0 && (
//           <li>Services: {station.services.join(", ")}</li>
//         )}
//         {fuels.length > 0 && <li>Fuel: {fuels.join(", ")}</li>}
//       </ul>
//     </div>
//   );
// }

import { Link } from "react-router-dom";

export default function StationCard({ station }) {
  const fuels = station.fuels ?? station.FuelType ?? [];

  return (
    <Link
      to={`/station/${station.id}`}
      className="station-card"
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
      aria-label={`View details for ${station.name}`}
    >
      <h3 className="station-card__title">{station.name}</h3>
      <p className="muted">{station.address}</p>

      {typeof station.distanceKm === "number" && (
        <p className="muted" style={{ marginTop: 4 }}>
          {station.distanceKm} km away
        </p>
      )}

      <ul className="meta">
        <li>Open: {station.hours}</li>
        {station.services?.length > 0 && (
          <li>Services: {station.services.join(", ")}</li>
        )}
        {fuels.length > 0 && <li>Fuel: {fuels.join(", ")}</li>}
      </ul>
    </Link>
  );
}
