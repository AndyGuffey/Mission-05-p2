export default function SearchBar({
  value,
  onChange,
  onUseLocation,
  onSearch,
}) {
  return (
    <div className="searchbar">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch(); // immediate fetch on Enter
        }}
        placeholder="Enter a location, suburb, or station name"
      />
      <button className="btn btn-ghost" onClick={onUseLocation}>
        Use my location
      </button>
      <button className="btn btn-primary" onClick={onSearch}>
        Apply filters
      </button>
    </div>
  );
}
