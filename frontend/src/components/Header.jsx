import { Link, NavLink } from "react-router-dom";
import NavTabs from "./NavTabs.jsx";
import "../styles/header.css";
import searchimg from "../assets/searchsymbols.jpg";
import "../styles/theme.css";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Header() {
  return (
    <header className="header">
      <div className="header-row">
        <Link to="/" className="brand">
          <img src="/logo-z.svg" alt="Z" />
        </Link>

        <NavTabs />

        <div className="header-cta">
          <button className="btn btn-ghost">Z App</button>
          <button className="btn btn-ghost">About Z</button>
          <button className="btn btn-ghost">
            <img src={searchimg} alt="Search" />
          </button>
          <button className="btn btn-primary">Login</button>
          <ThemeToggle />
        </div>
      </div>

      <div className="header-sub">
        <nav className="subnav">
          <a
            className="subnav-link"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            At the Station
          </a>
          <a
            className="subnav-link"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Rewards and promotions
          </a>

          <NavLink to="/find-station" className="subnav-link">
            Find a station
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
