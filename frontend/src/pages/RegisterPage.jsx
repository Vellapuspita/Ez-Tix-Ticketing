import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (form.password !== form.confirmPassword) {
    setError("Kata sandi tidak cocok!");
    return;
  }

  try {
    setIsLoading(true);

    await axios.post(
      "http://localhost:4000/api/auth/register",
      {
        name: form.name,
        email: form.email,
        password: form.password,
      }
    );

    navigate("/login");   // ⭐ INI WAJIB

  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Registrasi gagal. Coba lagi.";
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
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
            className="w-full rounded-xl border px-3 py-2 text-sm"
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
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Masukkan email"
            onChange={handleChange}
            value={form.email}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1 text-sm relative">
          <label className="font-medium">Kata Sandi</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className="w-full rounded-xl border px-3 py-2 pr-10 text-sm"
            placeholder="Masukkan kata sandi"
            onChange={handleChange}
            value={form.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1 text-sm relative">
          <label className="font-medium">Ulangi Kata Sandi</label>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className="w-full rounded-xl border px-3 py-2 pr-10 text-sm"
            placeholder="Ulangi kata sandi"
            onChange={handleChange}
            value={form.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold disabled:bg-gray-400"
        >
          {isLoading ? "Memproses..." : "Buat Akun"}
        </button>
      </form>
    </div>
  );
}
