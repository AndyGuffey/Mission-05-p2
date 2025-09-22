export default function FeatureCard({ icon = "⛽", title, children }) {
  return (
    <div className="feature-card">
      <div className="feature-icon" aria-hidden>
        {icon}
      </div>
      <div className="feature-body">
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
      <button className="icon-btn" aria-label="Go">
        {">"}
      </button>
    </div>
  );
}
