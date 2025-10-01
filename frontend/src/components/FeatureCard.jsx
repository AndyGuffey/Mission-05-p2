export default function FeatureCard({
  iconSrc,
  iconAlt = "",
  title,
  children,
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <img className="feature-icon-img" src={iconSrc} alt={iconAlt} />
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
