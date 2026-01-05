import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

const API_ORIGIN = "http://localhost:4000"; // sesuaikan jika beda

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [initials, setInitials] = useState("S");
  const [avatarUrl, setAvatarUrl] = useState("");

  // =========================
  // ✅ Search: ambil & simpan di URL (?q=)
  // =========================
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const qFromUrl = (params.get("q") || "").toString();

  const [navQ, setNavQ] = useState(qFromUrl);

  // sync state input kalau user pindah route / back / forward
  useEffect(() => {
    setNavQ(qFromUrl);
  }, [qFromUrl]);

  const setQueryToCurrentPage = (nextQ) => {
    const q = nextQ.trim();
    const sp = new URLSearchParams(location.search);

    if (q) sp.set("q", q);
    else sp.delete("q");

    // ✅ tetap di halaman yang sama, hanya update query string
    navigate(`${location.pathname}?${sp.toString()}`, { replace: true });
  };

  const clearQuery = () => {
    setNavQ("");
    const sp = new URLSearchParams(location.search);
    sp.delete("q");
    navigate(`${location.pathname}?${sp.toString()}`, { replace: true });
  };

  // =========================
  // Avatar sync
  // =========================
  const syncAvatar = () => {
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    const profilePicture = localStorage.getItem("userProfilePicture"); // /uploads/xxx.png

    if (userName && token) setInitials(userName.charAt(0).toUpperCase());
    else setInitials("S");

    if (profilePicture && token) setAvatarUrl(`${API_ORIGIN}${profilePicture}?v=${Date.now()}`);
    else setAvatarUrl("");
  };

  useEffect(() => {
    syncAvatar();
    window.addEventListener("storage", syncAvatar);
    window.addEventListener("profile_updated", syncAvatar);
    return () => {
      window.removeEventListener("storage", syncAvatar);
      window.removeEventListener("profile_updated", syncAvatar);
    };
  }, []);

  // =========================
  // Optional: kalau user lagi di halaman yang bukan dashboard/events,
  // kamu bisa pilih mau:
  // - tetap update query di halaman itu (default sekarang)
  // - atau otomatis pindah ke /events
  //
  // Kalau mau auto pindah: uncomment isAllowed below
  // =========================
  // const isAllowed = location.pathname === "/" || location.pathname === "/events";

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <nav className="w-full bg-gradient-to-r from-[#F4A623] to-[#F6B34B] py-3 shadow relative">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* MENU LEFT */}
          <div className="flex items-center gap-10 font-semibold text-sm justify-between h-16">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "relative pb-2 text-white" : "relative pb-2 text-black")}
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
              className={({ isActive }) => (isActive ? "relative pb-2 text-white" : "relative pb-2 text-black")}
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
              className={({ isActive }) => (isActive ? "relative pb-2 text-white" : "relative pb-2 text-black")}
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
                placeholder={
                  location.pathname === "/"
                    ? "Cari event di Dashboard..."
                    : location.pathname === "/events"
                    ? "Cari event di Acara..."
                    : "Cari..."
                }
                value={navQ}
                onChange={(e) => {
                  const next = e.target.value;
                  setNavQ(next);

                  // ✅ update query sesuai halaman yang sedang dibuka
                  // kalau mau auto pindah ke /events, taruh logic di sini.
                  setQueryToCurrentPage(next);

                  // contoh auto pindah:
                  // if (!isAllowed) navigate(`/events?q=${encodeURIComponent(next)}`);
                }}
              />

              <span className="material-icons absolute left-3 top-1.5 text-gray-500 text-base">search</span>

              {!!navQ && (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="material-icons absolute right-3 top-1.5 text-gray-500 text-base"
                  aria-label="clear"
                >
                  close
                </button>
              )}
            </div>

            {/* Avatar */}
            <button
              className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-[#F4A623] font-semibold shadow overflow-hidden"
              onClick={() => navigate("/profile")}
              aria-label="Open profile"
              type="button"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </div>
    </div>
  );
}
