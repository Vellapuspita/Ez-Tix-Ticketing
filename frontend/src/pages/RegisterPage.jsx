// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass !== confirm) {
      setError("Sepertinya ada typo, coba samakan lagi");
      return;
    }
    setError("");
    localStorage.setItem("token", "dummy-token");
    localStorage.setItem("username", username || "Pengguna");
    navigate("/", { replace: true });
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-extrabold text-center mb-1">
        EZ-TIX
      </h1>
      <p className="text-sm text-center text-slate-500 mb-6">
        Silakan buat akun anda
      </p>

      {error && (
        <div className="mb-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nama pengguna</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan nama pengguna"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            Kata sandi (Maks. 24 karakter)
          </label>
          <input
            type="password"
            maxLength={24}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Masukkan kata sandi"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Ulangi kata sandi</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Masukkan ulang kata sandi"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-[#F0A33F] text-black font-semibold py-2 rounded-full shadow hover:bg-[#f3b455]"
        >
          Buat akun
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500 text-center">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-orange-600 hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
