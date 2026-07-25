const Card = ({ children, className = "", onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-100/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 p-6 shadow-premium dark:shadow-none hover:shadow-indigo-500/5 transition-all duration-300 ${onClick ? "cursor-pointer hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:translate-y-[-2px]" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
