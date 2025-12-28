import { useEffect } from "react";

export function Modal({ open, title, children, onClose, widthClass = "max-w-[640px]" }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full ${widthClass} bg-white rounded-[22px] shadow-xl`}>
          <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
            <h3 className="font-extrabold text-black">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5" aria-label="Close">
              <span className="material-icons">close</span>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Toast({ open, text, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), 1600);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed z-[70] top-5 left-1/2 -translate-x-1/2">
      <div className="bg-white shadow-lg rounded-2xl px-5 py-3 border border-black/10 flex items-center gap-2">
        <span className="material-icons text-green-600">check_circle</span>
        <p className="font-semibold text-black">{text}</p>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = "Konfirmasi", message, onYes, onNo }) {
  return (
    <Modal open={open} title={title} onClose={onNo} widthClass="max-w-[520px]">
      <div className="flex flex-col items-center text-center gap-4">
        <p className="text-black font-semibold">{message}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={onYes}
            className="px-8 py-2 rounded-xl bg-[#F6B14A] font-extrabold text-black hover:bg-[#f0a63e]"
          >
            Iya
          </button>
          <button
            onClick={onNo}
            className="px-8 py-2 rounded-xl bg-red-500 font-extrabold text-white hover:bg-red-600"
          >
            Tidak
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center justify-end gap-2">
      <button
        className="p-2 rounded-xl hover:bg-black/5"
        onClick={() => onChange(Math.max(1, page - 1))}
        aria-label="Prev"
      >
        <span className="material-icons">chevron_left</span>
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg font-bold ${
            p === page ? "bg-[#F9E04A]" : "bg-transparent hover:bg-black/5"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        className="p-2 rounded-xl hover:bg-black/5"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        aria-label="Next"
      >
        <span className="material-icons">chevron_right</span>
      </button>
    </div>
  );
}
