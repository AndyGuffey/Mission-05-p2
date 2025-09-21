import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FindStation from "./pages/FindStation";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-station" element={<FindStation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
