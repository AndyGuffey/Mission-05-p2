const stations = [
  {
    name: "Z Energy Ponsonby",
    address: "182 Richmond Road, Ponsonby, Auckland 1021",
    isOpen24Hours: true,
    services: ["Charging", "Food", "Restroom", "Shop"],
    FuelType: ["91", "95", "98", "Diesel", "EV"],
    location: {
      type: "Point",
      coordinates: [174.7367, -36.8589], // [longitude, latitude]
    },
  },
  {
    name: "Z Energy Grafton",
    address: "76 Grafton Road, Grafton, Auckland 1010",
    isOpen24Hours: false,
    services: ["Food", "Restroom", "Shop"],
    FuelType: ["91", "95", "Diesel"],
    location: {
      type: "Point",
      coordinates: [174.7685, -36.8641],
    },
  },
  {
    name: "Z Energy Albany",
    address: "55 Corinthian Drive, Albany, Auckland 0632",
    isOpen24Hours: true,
    services: ["Charging", "Restroom", "Shop", "Car Wash"],
    FuelType: ["91", "95", "98", "EV"],
    location: {
      type: "Point",
      coordinates: [174.7093, -36.7282],
    },
  },
  {
    name: "Z Energy Botany",
    address: "277 Ti Rakau Drive, Botany Downs, Auckland 2013",
    isOpen24Hours: false,
    services: ["Restroom", "Shop"],
    FuelType: ["95", "98", "Diesel", "EV"],
    location: {
      type: "Point",
      coordinates: [174.9139, -36.9338],
    },
  },
  {
    name: "Z Energy Sylvia Park",
    address: "286 Mt Wellington Highway, Mt Wellington, Auckland 1060",
    isOpen24Hours: true,
    services: ["Charging", "Food", "Restroom", "Shop", "Car Wash"],
    FuelType: ["91", "98", "Diesel", "EV"],
    location: {
      type: "Point",
      coordinates: [174.8439, -36.9167],
    },
  },
];

module.exports = stations;
