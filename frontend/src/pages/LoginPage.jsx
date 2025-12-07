import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: call backend
    if (!email || !password) {
      setError("Ups! Email atau password kamu tidak cocok");
      return;
    }
    setError("");
    localStorage.setItem("token", "dummy");
    navigate("/");
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
          />
        </div>

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

        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
