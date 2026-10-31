const Spinner = ({ label = "Loading", className = "p-12" }) => (
  <div className={`flex items-center justify-center gap-3 text-gray-500 ${className}`} role="status">
    <span className="spinner" aria-hidden="true" />
    <span className="text-sm">{label}...</span>
  </div>
);

export default Spinner;
