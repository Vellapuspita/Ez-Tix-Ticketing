import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_ORIGIN = "http://localhost:4000"; // sesuaikan jika beda

export default function MainLayout() {
  const navigate = useNavigate();

  const [initials, setInitials] = useState("S");
  const [avatarUrl, setAvatarUrl] = useState(""); // ✅ foto dari backend

  const syncAvatar = () => {
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    const profilePicture = localStorage.getItem("userProfilePicture"); // ✅ path: /uploads/xxx.png

    if (userName && token) {
      setInitials(userName.charAt(0).toUpperCase());
    } else {
      setInitials("S");
    }

    if (profilePicture && token) {
      // cache buster biar kalau ganti file dengan nama sama, tetap refresh
      setAvatarUrl(`${API_ORIGIN}${profilePicture}?v=${Date.now()}`);
    } else {
      setAvatarUrl("");
    }
  };

  useEffect(() => {
    syncAvatar();

    // event storage biasanya cuma kebaca antar-tab
    window.addEventListener("storage", syncAvatar);

    // ✅ event custom (biar 1 tab juga update)
    window.addEventListener("profile_updated", syncAvatar);

    return () => {
      window.removeEventListener("storage", syncAvatar);
      window.removeEventListener("profile_updated", syncAvatar);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* NAVBAR */}
      <nav className="w-full bg-gradient-to-r from-[#F4A623] to-[#F6B34B] py-3 shadow relative">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* MENU LEFT */}
          <div className="flex items-center gap-10 font-semibold text-sm justify-between h-16">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "relative pb-2 text-white" : "relative pb-2 text-black"
              }
            >
              Dashboard
              <span
                className={`absolute left-0 right-0 h-[3px] -bottom-3 rounded-t-full ${
                  window.location.pathname === "/" ? "bg-white" : "bg-transparent"
                }`}
              />
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "relative pb-2 text-white" : "relative pb-2 text-black"
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
                isActive ? "relative pb-2 text-white" : "relative pb-2 text-black"
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

            {/* ✅ Avatar: Foto dulu, kalau gak ada baru inisial */}
            <button
              className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-[#F4A623] font-semibold shadow overflow-hidden"
              onClick={() => navigate("/profile")}
              aria-label="Open profile"
              type="button"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </button>
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
