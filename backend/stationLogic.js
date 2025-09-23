const Zstation = require("./models/Zstations");

// ----- services (unchanged) -----
function serviceRegexes(label) {
  switch (label) {
    case "Car wash":
      return [/^car\s*wash$/i, /^carwash$/i];
    case "EV charging":
      return [/^(ev\s*charging|charging)$/i];
    case "LPG":
      return [/^lpg$/i];
    case "Trailer hire":
      return [/^trailer(\s|-)?hire$/i];
    case "Food":
      return [/^food$/i];
    case "Shop":
      return [/^(shop|store|convenience|mini\s?mart|z\s?shop)$/i];
    case "Restroom":
      return [/^(restroom|toilets?|washroom|bathroom|wc)$/i];
    default:
      return [new RegExp(`^${label}$`, "i")];
  }
}

// ----- fuels: synonyms + normalization -----
function fuelRegex(label = "") {
  const t = String(label).trim().toLowerCase();
  if (["ev", "ev charging", "electric", "ev-charging"].includes(t))
    return /^(ev|ev\s*charging|electric)$/i;
  if (t === "diesel") return /^diesel$/i;
  if (["91", "95", "98"].includes(t)) return new RegExp(`^${t}$`, "i");
  return new RegExp(`^${label}$`, "i");
}
function normalizeFuel(s = "") {
  const t = String(s).trim().toLowerCase();
  if (["ev", "ev charging", "electric"].includes(t)) return "EV";
  if (t === "diesel") return "Diesel";
  if (["91", "95", "98"].includes(t)) return t;
  return s;
}

function shape(d) {
  return {
    id: String(d._id),
    name: d.name,
    address: d.address,
    hours: d.isOpen24Hours ? "24 hours" : d.hours || "",
    services: (d.services || []).map((s) => {
      const t = String(s).toLowerCase();
      if (t === "charging") return "EV charging";
      if (t === "car wash") return "Car wash";
      if (t === "lpg") return "LPG";
      if (t === "trailer hire") return "Trailer hire";
      if (t === "food") return "Food";
      if (["shop", "store", "convenience", "mini mart", "z shop"].includes(t))
        return "Shop";
      if (
        [
          "restroom",
          "toilet",
          "toilets",
          "washroom",
          "bathroom",
          "wc",
        ].includes(t)
      )
        return "Restroom";
      return s;
    }),
    // ✅ always return a normalized `fuels` array
    fuels: (d.fuels ?? d.FuelType ?? []).map(normalizeFuel),
    lat: d.location?.coordinates?.[1],
    lng: d.location?.coordinates?.[0],
    ...(d.distanceMeters != null
      ? { distanceKm: Math.round(d.distanceMeters / 100) / 10 }
      : {}),
  };
}

async function getStations({
  query = "",
  service = "",
  fuel = "",
  near = "",
  limit = "50",
} = {}) {
  const lim = Math.min(parseInt(limit) || 50, 200);

  // Build conditions as AND of clauses (so $or blocks can coexist)
  const and = [];

  if (query.trim()) {
    const q = query.trim();
    and.push({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
      ],
    });
  }

  if (service) {
    and.push({ services: { $in: serviceRegexes(service) } });
  }

  if (fuel) {
    const rx = fuelRegex(fuel);
    // ✅ match either field; both are arrays so regex matches any element
    and.push({ $or: [{ FuelType: rx }, { fuels: rx }] });
  }

  const filter = and.length ? { $and: and } : {};

  if (near) {
    const [latStr, lngStr] = near.split(",");
    const lat = Number(latStr),
      lng = Number(lngStr);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      const docs = await Zstation.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "distanceMeters",
            spherical: true,
            query: filter,
          },
        },
        { $limit: lim },
      ]);
      return docs.map(shape);
    }
  }

  const docs = await Zstation.find(filter).limit(lim).lean();
  return docs.map(shape);
}

async function getStationById(id) {
  const d = await Zstation.findById(id).lean();
  if (!d) return null;
  return shape(d);
}
module.exports = { getStations, getStationById };
