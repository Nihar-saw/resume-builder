import Loader from "./Loader";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-extrabold border-2.5 border-black rounded-xl neo-btn cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#0ae448] text-black hover:bg-[#3dff6e]",
    secondary: "bg-[#facc15] text-black hover:bg-[#fde047]",
    pink: "bg-[#ff007a] text-white hover:bg-[#ff3399]",
    cyan: "bg-[#06b6d4] text-black hover:bg-[#22d3ee]",
    outline: "bg-[#1c1c22] text-white hover:bg-[#282830] border-black",
    danger: "bg-red-500 text-white hover:bg-red-600 border-black",
    ghost: "bg-transparent text-slate-200 border-transparent shadow-none hover:bg-white/10 hover:border-black hover:shadow-[3px_3px_0px_0px_#000]",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs tracking-wide uppercase",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-7 py-3.5 text-base tracking-wide",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {loading && (
        <Loader
          size="sm"
          color={variant === "primary" || variant === "secondary" ? "dark" : "white"}
          className="mr-2"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
