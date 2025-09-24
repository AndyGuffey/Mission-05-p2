import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { GoogleMapsProvider } from "./components/GoogleMapsProvider";
import Home from "./pages/Home";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import FindStation from "./pages/FindStation";
import StationDetail from "./pages/StationDetail";

// import "./App.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/find-station" element={<FindStation />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
export default function App() {
  return (
    <div className="app-shell">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-station" element={<FindStation />} />
        <Route path="/station/:id" element={<StationDetail />} />
      </Routes>
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
