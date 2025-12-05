// src/pages/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass !== confirm) {
      setError("Sepertinya ada typo, coba samakan lagi");
      return;
    }
    setError("");
    setSuccess("Ubah kata sandi berhasil");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-extrabold text-center mb-1">
        EZ-TIX
      </h1>
      <p className="text-sm text-center text-slate-500 mb-6">
        Buat kata sandi baru
      </p>

      {error && (
        <div className="mb-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-3 text-xs text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          {success}
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
          <label className="text-sm font-medium">Kata sandi baru</label>
          <input
            type="password"
            placeholder="Masukkan kata sandi baru"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Ulangi kata sandi baru</label>
          <input
            type="password"
            placeholder="Masukkan ulang kata sandi baru"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-[#F0A33F] text-black font-semibold py-2 rounded-full shadow hover:bg-[#f3b455]"
        >
          Ubah kata sandi
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500 text-center">
        Kembali ke{" "}
        <Link to="/login" className="text-orange-600 hover:underline">
          halaman login
        </Link>
      </p>
    </div>
  );
}
