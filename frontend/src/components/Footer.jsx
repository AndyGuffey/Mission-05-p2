export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div>
          <h4>Products and services</h4>
          <a href="#">At the station</a>
          <a href="#">Z App</a>
          <a href="#">Rewards and promotions</a>
        </div>
        <div>
          <h4>For business</h4>
          <a href="#">Z Business fuel card</a>
          <a href="#">Fuel cards and services</a>
          <a href="#">Business tips and ideas</a>
        </div>
        <div>
          <h4>About Z</h4>
          <a href="#">Our people</a>
          <a href="#">News</a>
          <a href="#">Careers at Z</a>
        </div>
        <div>
          <h4>Get the app</h4>
          <div className="store-badges">
            <img src="/app-store.svg" alt="App Store" />
            <img src="/play-store.svg" alt="Google Play" />
          </div>
        </div>
      </div>
      <div className="footer-meta">
        © {new Date().getFullYear()} Z Energy — All rights reserved.
      </div>
    </footer>
  );
}
