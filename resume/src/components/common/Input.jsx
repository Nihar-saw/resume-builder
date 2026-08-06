const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  className = "",
  rows = 4,
  ...props
}) => {
  const isTextarea = type === "textarea";

  const baseInputStyle =
    "w-full rounded-xl border-2.5 border-black bg-[#18181c] px-4 py-2.5 text-sm font-medium text-white placeholder:text-slate-500 shadow-[3px_3px_0px_0px_#000] focus:shadow-[5px_5px_0px_0px_#0ae448] focus:outline-none transition-all duration-150";

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-black uppercase tracking-wider text-slate-300"
        >
          {label}
        </label>
      )}
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${baseInputStyle} resize-y min-h-24 ${
            error ? "border-red-500 focus:shadow-[5px_5px_0px_0px_#ef4444]" : ""
          }`}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${baseInputStyle} ${
            error ? "border-red-500 focus:shadow-[5px_5px_0px_0px_#ef4444]" : ""
          }`}
          {...props}
        />
      )}
      {error && (
        <span className="text-xs font-extrabold text-red-400 bg-red-950/40 border border-red-500/50 px-2 py-0.5 rounded-md inline-block w-fit">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
