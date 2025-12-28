import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const DUMMY_ADMIN = {
  email: "admin@eztix.com",
  password: "admin123",
  name: "Arya Genta",
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLoginAdmin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email atau kata sandi tidak boleh kosong.");
      return;
    }

    try {
      setIsLoading(true);

      // ✅ Dummy login (simulasi request)
      await new Promise((r) => setTimeout(r, 500));

      if (email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password) {
        localStorage.setItem("adminToken", "dummy-admin-token");
        localStorage.setItem("adminName", DUMMY_ADMIN.name);
        navigate("/admin", { replace: true });
        return;
      }

      setError("Login admin gagal. Periksa email dan kata sandi Anda.");
    } catch (err) {
      setError("Terjadi kesalahan saat login admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full">
      {/* optional link balik */}
      <p className="text-xs text-muted mb-2">
        Kembali ke{" "}
        <Link to="/login" className="text-primary font-medium">
          Login Customer
        </Link>
      </p>

      <h1 className="text-2xl font-bold mb-1">LOGIN ADMIN EZ-TIX</h1>
      <p className="text-sm text-muted mb-6">
        Masuk untuk mengelola acara dan tiket
      </p>

      <form onSubmit={handleLoginAdmin} className="space-y-4">
        {/* Email */}
        <div className="space-y-1 text-sm">
          <label className="font-medium">Email</label>
          <input
            type="email"
            className={`w-full rounded-xl border px-3 py-2 text-sm ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan email admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-[11px] text-black/50 mt-1">
            Dummy: admin@eztix.com
          </p>
        </div>

        {/* Password */}
        <div className="space-y-1 text-sm relative">
          <label className="font-medium">Kata sandi</label>
          <input
            type={showPassword ? "text" : "password"}
            className={`w-full rounded-xl border px-3 py-2 pr-10 text-sm ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan password admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <p className="text-[11px] text-black/50 mt-1">
            Dummy: admin123
          </p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* optional */}
        <div className="flex justify-between items-center text-xs mt-1">
          <button
            type="button"
            onClick={() => setError("Fitur reset password admin belum tersedia.")}
            className="text-muted hover:text-primary"
          >
            Lupa kata sandi?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold disabled:bg-gray-400"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
