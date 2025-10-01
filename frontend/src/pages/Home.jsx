// import React from "react";

// export default function Home() {
//   return (
//     <div>
//       <h1>HomePage - landing page</h1>
//     </div>
//   );
// }
import { NavLink } from "react-router-dom";
import FeatureCard from "../components/FeatureCard.jsx";
import heroImg from "../assets/Hero.svg";
import trailerSvg from "../assets/trailer.svg";
import carwashSvg from "../assets/car-wash.svg";
import lpgSvg from "../assets/lpg.svg";
import foodSvg from "../assets/food.svg";
import "../styles/home.css";
import "../styles/base.css";

export default function Home() {
  return (
    <>
      <section className="hero">
        <img className="hero-img" src={heroImg} alt="Z station at dusk" />
        <div className="hero-content">
          <h1 className="hero-title">
            Z is For <br /> New Zealand
          </h1>
          <p className="hero-subtitle">
            Powering better journeys, <br /> today and tomorrow
          </p>
        </div>
      </section>
      <section className="hero-gradient">
        <div className="hero-content">
          <h1 className="hero-title">
            There when you <br /> need us
          </h1>
        </div>
        <div className="hero-copy">
          <NavLink to="/find-station" className="btn btn-primary">
            Find your local Z
          </NavLink>
        </div>
      </section>
      <section className="what-you-need-section">
        <div className="what-you-need">
          <h2>
            What you need, made
            <br /> easy
          </h2>
          <p>
            Moving furniture? Hungry for a pie and barista made coffee? Have a{" "}
            <br />
            dirty car that needs some love? Come on in - we’ve got you covered
          </p>
        </div>
        <div className="feature-grid">
          <FeatureCard
            iconSrc={trailerSvg}
            iconAlt="Trailer hire"
            title="Trailer hire"
          ></FeatureCard>
          <FeatureCard
            iconSrc={carwashSvg}
            iconAlt="Car wash"
            title="Car Wash"
          ></FeatureCard>
          <FeatureCard
            iconSrc={lpgSvg}
            iconAlt="LPG bottle swap"
            title="LPG bottle swap"
          ></FeatureCard>
          <FeatureCard
            iconSrc={foodSvg}
            iconAlt="Food and drink"
            title="Food & Drink"
          ></FeatureCard>
        </div>
      </section>
      <section className="hero-gradient">
        <div className="hero-content">
          <h1 className="hero-title">
            Make the most <br /> of Z
          </h1>
        </div>
        <div className="hero-copy">
          <NavLink to="/" className="btn btn-primary">
            Download the Z App now
          </NavLink>
        </div>
      </section>
    </>
  );
}
