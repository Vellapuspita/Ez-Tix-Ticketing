export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-dark hover:bg-gray-100",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`${base} ${sizes[size]} ${
        disabled ? variants.disabled : variants[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
}
