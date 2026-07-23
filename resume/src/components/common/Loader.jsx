const Loader = ({ size = "md", color = "primary", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-indigo-600 border-t-transparent",
    accent: "border-violet-600 border-t-transparent",
    white: "border-white border-t-transparent",
    slate: "border-slate-600 border-t-transparent",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary}`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Loader;
