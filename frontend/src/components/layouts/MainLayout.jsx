import { NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { useState } from "react";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "P";

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">

      {/* NAVBAR - GRADIENT ORANGE */}
      <header className="bg-gradient-to-r from-[#EFA130] to-[#F4A641] shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center gap-10">

          {/* LOGO */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} className="w-12 drop-shadow-md" />
            <span className="font-extrabold text-xl text-[#2B2B2B]">EZ-TIX</span>
          </div>

          {/* MENU */}
          <nav className="flex gap-6 font-semibold text-[#2B2B2B]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "border-b-4 border-white pb-1 text-black"
                  : "hover:text-black"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/events"
              className="hover:text-black"
            >
              Acara
            </NavLink>

            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                isActive
                  ? "border-b-4 border-white pb-1 text-black"
                  : "hover:text-black"
              }
            >
              Tiketku
            </NavLink>
          </nav>

          {/* SPACER */}
          <div className="flex-1" />

          {/* SEARCH FIELD */}
          <div className="hidden md:flex items-center relative">
            <input
              type="text"
              placeholder="Cari acara..."
              className="w-72 rounded-full px-4 py-2 pl-10 border border-[#E0E0E0] bg-white text-sm focus:ring-2 focus:ring-orange-400 shadow-sm"
            />
            <span className="material-icons absolute left-3 top-2 text-gray-400 text-md">
              search
            </span>
          </div>

          {/* PROFILE ICON */}
          <button
            onClick={() => navigate("/profile")}
            className="rounded-full w-10 h-10 bg-white flex items-center justify-center border-2 border-orange-600 text-orange-600 font-bold shadow-md hover:bg-orange-50"
          >
            {username.charAt(0).toUpperCase()}
          </button>

        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto w-full px-6 lg:px-10 py-10">
        {children}
      </main>

    </div>
  );
}
