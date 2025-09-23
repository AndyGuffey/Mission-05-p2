import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
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
      <nav className="top-tabs">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        >
          For personal
        </NavLink>
        <NavLink
          to="/business"
          className="tab"
          onClick={(e) => e.preventDefault()}
        >
          For business
        </NavLink>
        <a className="tab" href="#" onClick={(e) => e.preventDefault()}>
          Z App
        </a>
        <a className="tab" href="#" onClick={(e) => e.preventDefault()}>
          About Z
        </a>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-station" element={<FindStation />} />
        <Route path="/station/:id" element={<StationDetail />} />
      </Routes>

      <Footer />
    </div>
  );
}
