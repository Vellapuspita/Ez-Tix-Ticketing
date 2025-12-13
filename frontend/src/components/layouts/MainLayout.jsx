import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // <-- IMPORT INI

export default function MainLayout() {
  const navigate = useNavigate();
  // --- STATE UNTUK INISIAL ---
  const [initials, setInitials] = useState('S'); 

  // ===============================================================
  // LOGIC AMBIL INISIAL DARI LOCAL STORAGE
  // ===============================================================
  const updateInitials = () => {
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    
    if (userName && token) {
      // Jika ada nama dan token, gunakan inisial dari nama
      setInitials(userName.charAt(0).toUpperCase());
    } else {
      // Jika tidak ada token (belum login), biarkan sebagai 'S' (atau ikon login)
      setInitials('S'); 
    }
  };

  useEffect(() => {
    // Jalankan saat komponen dimuat
    updateInitials();

    // Tambahkan event listener untuk merespons perubahan storage (misal: saat logout)
    window.addEventListener('storage', updateInitials);
    
    return () => {
        // Bersihkan event listener saat komponen dilepas
        window.removeEventListener('storage', updateInitials);
    };
  }, []); 
  // ===============================================================


  return (
    <div className="min-h-screen bg-[#F7F7F7]">

      {/* NAVBAR */}
      <nav className="w-full bg-gradient-to-r from-[#F4A623] to-[#F6B34B] py-3 shadow relative">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

          {/* MENU LEFT */}
          {/* ... (Menu Dashboard, Acara, Tiketku tetap sama) ... */}
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

            {/* Avatar - Gunakan state initials yang baru */}
            <div
              className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-[#F4A623] font-semibold shadow cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {initials} {/* <-- PERUBAHAN KRITIS */}
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