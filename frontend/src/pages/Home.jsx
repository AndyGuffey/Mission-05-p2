// import React from "react";

// export default function Home() {
//   return (
//     <div>
//       <h1>HomePage - landing page</h1>
//     </div>
//   );
// }
import { Link, NavLink } from "react-router-dom";
import FeatureCard from "../components/FeatureCard.jsx";
import FindStation from "./FindStation.jsx";
import heroImg from "../assets/hero-station.jpg";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <section className="hero">
        <img className="hero-img" src={heroImg} alt="Z station at dusk" />
      </section>
      <section className="hero-gradient"></section>
      <div className="hero-copy">
        <NavLink to="/find-station" className="btn btn-primary">
          Find your local Z
        </NavLink>
      </div>
      <section className="what-you-need-section">
        <div className="what-you-need">
          <h2>What you need, made easy</h2>
          <h5>
            Moving furniture? Hungry for a pie and barista made coffee? Have a
            dirty car that needs some love? Come on in - we’ve got you covered
          </h5>
        </div>
        <div className="feature-grid">
          <FeatureCard icon="🛻" title="Trailer hire"></FeatureCard>
          <FeatureCard icon="🚘" title="Car wash"></FeatureCard>
          <FeatureCard icon="🔁" title="LPG bottle swap"></FeatureCard>
          <FeatureCard icon="🍫" title="Food and drink"></FeatureCard>
        </div>
      </section>
      <section className="app-gradient"></section>
    </>
  );
}
