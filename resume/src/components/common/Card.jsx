const Card = ({ children, className = "", onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-100/80 bg-white p-6 shadow-premium hover:shadow-indigo-500/5 transition-all duration-300 ${onClick ? "cursor-pointer hover:border-indigo-100 hover:translate-y-[-2px]" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
