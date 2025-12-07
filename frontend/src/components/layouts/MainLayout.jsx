import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F7]">

      {/* NAVBAR */}
      <nav className="w-full bg-gradient-to-r from-[#F4A623] to-[#F6B34B] py-3 shadow relative">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

          {/* MENU LEFT */}
          <div className="flex items-center gap-10 font-semibold text-sm">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "relative pb-2 text-white"
                  : "relative pb-2 text-black"
              }
            >
              Dashboard
              {/* underline */}
              <span
                className={`absolute left-0 right-0 h-[3px] -bottom-3 rounded-t-full ${
                  window.location.pathname === "/" ? "bg-white" : "bg-transparent"
                }`}
              />
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive
                  ? "relative pb-2 text-white"
                  : "relative pb-2 text-black"
              }
            >
              Acara
              <span
                className={`absolute left-0 right-0 h-[3px] -bottom-3 rounded-t-full ${
                  window.location.pathname === "/events" ? "bg-white" : "bg-transparent"
                }`}
              />
            </NavLink>

            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                isActive
                  ? "relative pb-2 text-white"
                  : "relative pb-2 text-black"
              }
            >
              Tiketku
              <span
                className={`absolute left-0 right-0 h-[3px] -bottom-3 rounded-t-full ${
                  window.location.pathname === "/tickets" ? "bg-white" : "bg-transparent"
                }`}
              />
            </NavLink>

          </div>

          {/* SEARCH + AVATAR */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="w-64 bg-white rounded-full px-10 py-1.5 text-sm shadow focus:outline-none"
                placeholder="Cari acara..."
              />
              <span className="material-icons absolute left-3 top-1.5 text-gray-500 text-base">
                search
              </span>
            </div>

            {/* Avatar */}
            <div
              className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-[#F4A623] font-semibold shadow cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              S
            </div>

          </div>

        </div>
      </nav>

      {/* HALAMAN */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </div>
    </div>
  );
}
