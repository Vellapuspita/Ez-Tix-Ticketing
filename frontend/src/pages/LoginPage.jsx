import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => { 
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email atau kata sandi tidak boleh kosong.");
      return;
    }
    
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:4000/api/auth/login", 
        {
          email: email,
          password: password,
        }
      );

      // Jika Login berhasil (Status 200)
      const token = response.data.token;
      // --- AMBIL DATA USER DARI RESPONSE ---
      const userData = response.data.user; // Backend Anda mengirim object user
      const userName = userData ? userData.namaPengguna : 'Pengguna'; // Ambil nama pengguna
      // ------------------------------------

      if (token) {
        localStorage.setItem("token", token);
        
        // --- REVISI KRITIS DI SINI: SIMPAN NAMA PENGGUNA ---
        localStorage.setItem("userName", userName);
        // --------------------------------------------------

        // Redirect ke Dashboard setelah login sukses
        navigate("/"); 
      }
      
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.message || "Login gagal. Periksa email dan kata sandi Anda.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <p className="text-xs text-muted mb-2">
        Belum punya akun?{" "}
        <Link to="/register" className="text-primary font-medium">
          Daftar Sekarang!
        </Link>
      </p>
      <h1 className="text-2xl font-bold mb-1">SELAMAT DATANG DI EZ-TIX</h1>
      <p className="text-sm text-muted mb-6">
        Satu klik, ribuan pengalaman
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Input Email */}
        <div className="space-y-1 text-sm">
          <label className="font-medium">Email</label>
          <input
            type="email"
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none text-sm ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Input Password */}
        <div className="space-y-1 text-sm">
          <label className="font-medium">Kata sandi</label>
          <input
            type="password"
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none text-sm ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center text-xs mt-1">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-muted hover:text-primary"
          >
            Lupa kata sandi?
          </button>
        </div>

        {/* Tombol Login dengan Status Loading */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}