// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !pass) {
      setError("Ups! Email atau password kamu tidak cocok");
      return;
    }

    // dummy login
    localStorage.setItem("token", "dummy-token");
    localStorage.setItem("username", "Selina Maharani");
    navigate(redirect, { replace: true });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-1">
        SELAMAT DATANG DI EZ-TIX
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Satu klik, ribuan pengalaman
      </p>

      {error && (
        <div className="mb-3 text-xs text-red-500 font-medium bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Kata sandi</label>
          <input
            type="password"
            placeholder="Masukkan kata sandi"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/reset-password"
            className="text-xs text-slate-500 hover:text-orange-600 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-[#F0A33F] text-black font-semibold py-2 rounded-full shadow hover:bg-[#f3b455]"
        >
          Masuk
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Belum punya akun?{" "}
        <Link to="/register" className="text-orange-600 hover:underline">
          Daftar sekarang!
        </Link>
      </p>
    </div>
  );
}
