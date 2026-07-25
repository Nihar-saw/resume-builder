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
  
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
          className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-all duration-200 resize-y min-h-24 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
          className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-all duration-200 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          {...props}
        />
      )}
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
