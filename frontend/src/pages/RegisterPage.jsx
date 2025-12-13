import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // <-- WAJIB: Import Axios untuk komunikasi API

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk status loading

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => { // <-- JADIKAN ASYNC
    e.preventDefault();
    setError(""); // Reset error saat percobaan baru

    // 1. Validasi Password
    if (form.password !== form.confirmPassword) {
      setError("Kata sandi tidak cocok!");
      return;
    }

    try {
      setIsLoading(true);

      // 2. Panggilan API Register ke Backend
      const response = await axios.post(
        "http://localhost:4000/api/auth/register", // <-- URL Backend Register
        {
          name: form.name,
          email: form.email,
          password: form.password,
          // confirmPassword TIDAK dikirim ke backend
        }
      );

      // 3. Penanganan Sukses (Status 200/201)
      const token = response.data.token; // Asumsi backend mengirimkan token
      if (token) {
          localStorage.setItem("token", token); 
          // Setelah berhasil, arahkan ke halaman utama/dashboard
          navigate("/"); 
      } else {
          // Jika backend tidak mengirim token tetapi sukses
          navigate("/login"); // Arahkan ke login agar pengguna masuk
      }


    } catch (err) {
      // 4. Penanganan Error
      console.error("Registration Error:", err);
      // Ambil pesan error dari respons backend (misalnya, Email sudah terdaftar)
      const errorMessage = err.response?.data?.message || "Registrasi gagal. Coba lagi.";
      setError(errorMessage);
      
    } finally {
      setIsLoading(false); // Selesai loading
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
        {/* Input Nama */}
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

        {/* Input Email */}
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

        {/* Input Password */}
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

        {/* Input Confirm Password */}
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

        {/* Tampilkan Error */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Tombol Submit dengan Status Loading */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memproses..." : "Buat Akun"}
        </button>
      </form>
    </div>
  );
}