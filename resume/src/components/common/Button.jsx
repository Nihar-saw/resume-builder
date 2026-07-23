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
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-97";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-premium hover:shadow-indigo-500/20 focus:ring-indigo-500",
    secondary: "bg-violet-600 hover:bg-violet-700 text-white shadow-premium hover:shadow-violet-500/20 focus:ring-violet-500",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Loader size="sm" color={variant === "outline" || variant === "ghost" ? "primary" : "white"} className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
