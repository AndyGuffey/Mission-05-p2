# Z Stations Finder

A full-stack web application built with MongoDB, Express, React, and Node.js that helps users locate Z Energy stations, view their services, and find the nearest station based on their location.

This project was developed as part of an 8-day sprint for Mission Ready’s AI-Powered Advanced Full Stack Developer Diploma. The application was handed off from the UX/UI designers and implemented by the development team, following provided design specifications and user flows.

## Features

- Browse all Z Energy stations
- View station details including services offered
- Find nearest stations based on user location
- Filter stations by services (e.g., EV charging, shop, restroom)
- Interactive map view with clickable station markers

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Other**: Geospatial queries for location-based searching

## Getting Started

**Prerequisites**:

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Google Cloud API Key with Maps JavaScript API enabled
- Google Maps Map ID (if using custom map styling)

---

**Installation**:

1. **Clone the repository:**

```bash
git clone https://github.com/AndyGuffey/Mission-05-p2
cd Mission-05-p2
```

2. **Install dependencies:**

   recomended to open two seperate terminals- one for frontend and backend

```bash
cd mission-05p2
npm install
```

3. **Set up environment variables:**

Create a .env file inside the frontend directory and add:

```bash
VITE_API_BASE=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_GOOGLE_MAP_ID=your-google-maps-map-id
# Add other environment variables as needed
```

Create a .env file inside the backend directory and add:

```bash
MONGO_URI=mongodb://localhost:27017/zstations
PORT=4000
```

4. **Start the backend server:**

```bash
cd backend
npm install
npm start
```

4. **Start the frontend:**

```bash
cd ../frontend
npm install
npm run dev
```

---

**Seeding the Database**:

If you need to populate MongoDB with initial station data, run the seed script:

```bash
cd backend
npm run seed
```

This will insert sample station data into your MongoDB database.
Make sure your MongoDB server is running and your connection string is set correctly in your environment variables or config.

---

## Credits

Developed collaboratively by:

- [Andy Guffey](https://github.com/AndyGuffey)
- [Thousif Noor Quadir Hoseyn](https://github.com/thousifnm) ([thousifnm@gmail.com](mailto:thousifnm@gmail.com))

As part of [Mission Ready’s](https://www.missionreadyhq.com/?utm_source=google&utm_medium=cpc&gad_source=1&gad_campaignid=1689939568&gbraid=0AAAAAC3WQ6rSlROlTQwY3sHnzGH83qTkL&gclid=Cj0KCQjwovPGBhDxARIsAFhgkwSfMaZFRBEq1lCskO935vPZhwfYWpMcxW2gsTlEghar39g7uDLiUZkaApQhEALw_wcB) AI-Powered Advanced Full Stack Developer Diploma
