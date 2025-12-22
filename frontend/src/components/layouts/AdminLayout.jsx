import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const menu = [
  { to: "/admin", label: "Home", icon: "home" },
  { to: "/admin/stats", label: "Statistik penjualan", icon: "insert_chart" },
  { to: "/admin/users", label: "Kelola pengguna", icon: "group" },
  { to: "/admin/qr", label: "QR Code", icon: "qr_code_2" },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const adminName = "Arya Genta";
  const adminRole = "Admin";

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="h-full bg-[#EEF0E3] px-5 py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
            <span className="material-icons text-white text-[18px]">speed</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Dashboard</h1>
        </div>

        {/* close btn on mobile */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-black/5"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {menu.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between rounded-xl px-4 py-3 transition
              ${isActive(m.to) ? "bg-[#F6B14A]" : "bg-white hover:bg-[#f7f7f7]"}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-black">{m.icon}</span>
              <span className="font-semibold text-black">{m.label}</span>
            </div>
            <span className="material-icons text-black opacity-70">chevron_right</span>
          </NavLink>
        ))}
      </div>

      <div className="flex-1" />

      {/* Profile Card */}
      <div className="bg-[#F6B14A] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/70 flex items-center justify-center overflow-hidden">
            <span className="material-icons text-black">person</span>
          </div>
          <div>
            <p className="font-bold text-black leading-tight">{adminName}</p>
            <p className="text-sm text-black/80">{adminRole}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-[#F9E04A] hover:bg-[#f2d93f] text-black font-bold py-2 rounded-full shadow"
        >
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F6F8]">
      {/* Top bar for mobile/tablet */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#F6F6F8] border-b border-black/5">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl bg-white shadow-sm"
            aria-label="Open sidebar"
          >
            <span className="material-icons">menu</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <span className="material-icons text-white text-[16px]">speed</span>
            </div>
            <span className="font-bold text-black">Admin</span>
          </div>

          <div className="w-10" />
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[280px] min-h-screen">
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[86%] max-w-[320px] shadow-xl">
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
