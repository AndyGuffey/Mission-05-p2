import { Routes, Route, NavLink } from "react-router-dom";
import { GoogleMapsProvider } from "./components/GoogleMapsProvider";
import Home from "./pages/Home";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import FindStation from "./pages/FindStation";
import StationDetail from "./pages/StationDetail";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <GoogleMapsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-station" element={<FindStation />} />
          <Route path="/station/:id" element={<StationDetail />} />
        </Routes>
      </GoogleMapsProvider>

      <Footer />
    </div>
  );
}
