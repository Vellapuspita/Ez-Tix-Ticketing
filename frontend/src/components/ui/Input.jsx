export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = "",
  name,
}) {
  return (
    <div className={`w-full space-y-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-dark">{label}</label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-3 py-2 text-sm 
          focus:outline-none focus:ring-2 focus:ring-primary/40 
          ${
            error
              ? "border-red-500"
              : "border-gray-300 focus:border-primary"
          }`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
