// import React from "react";

// export default function Home() {
//   return (
//     <div>
//       <h1>HomePage - landing page</h1>
//     </div>
//   );
// }
import FeatureCard from "../components/FeatureCard.jsx";
import FindStation from "./FindStation.jsx";
import heroImg from "../assets/hero-station.jpg";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <section className="hero">
        <img className="hero-img" src={heroImg} alt="Z station at dusk" />
        <div className="hero-copy">
          <h1>Z is For New Zealand</h1>
          <p>Powering better journeys, today and tomorrow.</p>
          {/* Scroll to the embedded finder section */}
          <a href="#find-station" className="btn btn-primary">
            Find your local Z
          </a>
        </div>
        <div className="hero-gradient" />
      </section>

      <section className="what-you-need">
        <h2>What you need, made easy</h2>
        <div className="feature-grid">
          <FeatureCard icon="🛻" title="Trailer hire">
            Easy trailer rentals at selected stations.
          </FeatureCard>
          <FeatureCard icon="🚘" title="Car wash">
            Shine up with touch-free options.
          </FeatureCard>
          <FeatureCard icon="🔁" title="LPG bottle swap">
            Swap and go 9kg bottles.
          </FeatureCard>
          <FeatureCard icon="🍫" title="Food and drink">
            Snacks, barista coffee, and more.
          </FeatureCard>
        </div>
      </section>
    </>
  );
}
