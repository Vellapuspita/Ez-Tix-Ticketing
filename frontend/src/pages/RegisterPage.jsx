import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Kata sandi tidak cocok!");
      return;
    }

    // TODO: API register
    localStorage.setItem("token", "dummy");
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <p className="text-xs text-muted mb-2">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-primary font-medium">
          Masuk di sini
        </Link>
      </p>

      <h1 className="text-2xl font-bold mb-1">EZ-TIX</h1>
      <p className="text-sm text-muted mb-6">Silakan buat akun anda</p>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Nama */}
        <div className="space-y-1 text-sm">
          <label className="font-medium">Nama Lengkap</label>
          <input
            name="name"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Masukkan nama lengkap"
            onChange={handleChange}
            value={form.name}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1 text-sm">
          <label className="font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Masukkan email"
            onChange={handleChange}
            value={form.email}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1 text-sm">
          <label className="font-medium">Kata Sandi</label>
          <input
            name="password"
            type="password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Masukkan kata sandi"
            onChange={handleChange}
            value={form.password}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1 text-sm">
          <label className="font-medium">Ulangi Kata Sandi</label>
          <input
            name="confirmPassword"
            type="password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Ulangi kata sandi"
            onChange={handleChange}
            value={form.confirmPassword}
            required
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold"
        >
          Buat Akun
        </button>
      </form>
    </div>
  );
}
