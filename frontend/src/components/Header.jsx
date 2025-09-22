import { Link, NavLink } from "react-router-dom";
import NavTabs from "./NavTabs.jsx";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-row">
        <Link to="/" className="brand">
          <img src="/logo-z.svg" alt="Z" />
        </Link>

        <NavTabs />

        <div className="header-cta">
          <button className="btn btn-ghost">Log in</button>
          <button className="btn btn-primary">Sign up</button>
        </div>
      </div>

      <div className="header-sub">
        <nav className="subnav">
          <NavLink to="/find-station" className="subnav-link">
            Find a station
          </NavLink>
          <a
            className="subnav-link"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Power
          </a>
          <a
            className="subnav-link"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Rewards
          </a>
          <a
            className="subnav-link"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Promotions
          </a>
        </nav>
      </div>
    </header>
  );
}
