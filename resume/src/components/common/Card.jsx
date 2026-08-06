const Card = ({ children, className = "", onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border-3 border-black bg-[#131b2e] p-6 shadow-[6px_6px_0px_0px_#000] transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:border-[#0ae448] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_#000]"
          : "hover:border-slate-700 hover:shadow-[7px_7px_0px_0px_#000]"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
