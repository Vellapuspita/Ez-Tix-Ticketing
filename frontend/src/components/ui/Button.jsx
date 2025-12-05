// src/components/ui/Button.jsx
export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
