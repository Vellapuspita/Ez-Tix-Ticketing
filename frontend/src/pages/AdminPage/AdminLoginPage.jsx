import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../../utils/api";

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

    // Validasi dasar agar tidak mengirim request kosong ke backend
    if (!email || !password) {
      setError("Email atau kata sandi tidak boleh kosong.");
      return;
    }

    try {
      setIsLoading(true);

      // ✅ Integrasi API Login menggunakan axios instance (baseURL dari env)
      const response = await api.post("/auth/admin/login", {
        email,
        kataSandi: password,
      });

      const { token, user } = response.data;

      // ✅ Validasi Role: pastikan admin
      if (user?.role !== "admin") {
        // bersihin kalau bukan admin (biar token gak nyangkut)
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminRole");

        setError("Akses ditolak. Akun ini bukan merupakan akun Admin.");
        return;
      }

      // ✅ Simpan token khusus ADMIN (biar tidak bentrok dengan user)
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminName", user.namaPengguna);
      localStorage.setItem("adminRole", user.role);

      // ✅ Navigasi ke halaman utama admin
      navigate("/admin", { replace: true });
    } catch (err) {
      // Menampilkan pesan error spesifik dari backend (misal: "Password salah")
      const message =
        err?.response?.data?.message || "Terjadi kesalahan saat login admin.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Section */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/background.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Wrapper Form */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[980px] rounded-[22px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE: Login Form */}
            <div className="bg-white px-8 sm:px-12 py-10 sm:py-12">
              <div className="text-center">
                <h1 className="text-[22px] sm:text-[24px] font-extrabold leading-snug text-black">
                  SELAMAT DATANG <br /> DI EZ-TIX
                </h1>
                <p className="text-sm text-black/60 mt-2">
                  Kelola tiket acaramu disini!
                </p>
              </div>

              <form onSubmit={handleLoginAdmin} className="mt-8 space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan email admin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-[44px] rounded-xl px-4 text-sm outline-none border shadow-sm transition-all
                      ${
                        error
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-black/15 focus:border-[#F28B3C]"
                      }
                    `}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black">
                    Kata sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full h-[44px] rounded-xl px-4 pr-11 text-sm outline-none border shadow-sm transition-all
                        ${
                          error
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-black/15 focus:border-[#F28B3C]"
                        }
                      `}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-2">
                    <p className="text-[11px] text-red-600 font-medium">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[44px] rounded-xl bg-[#F28B3C] hover:bg-[#ea7f2e] text-white font-bold text-sm shadow-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memverifikasi Akun..." : "Masuk Sebagai Admin"}
                </button>

                {/* Optional Links */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-black/60 text-center">
                    Belum punya akun admin?{" "}
                    <Link
                      to="/register"
                      className="text-[#F28B3C] font-semibold hover:underline"
                    >
                      Daftar Admin
                    </Link>
                  </p>
                  <p className="text-[11px] text-black/40 text-center">
                    <Link to="/login" className="hover:underline">
                      Kembali ke login customer
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* RIGHT SIDE: Branding/Logo */}
            <div className="bg-[#EEF0E3] flex items-center justify-center p-8 sm:p-10">
              <div className="w-full max-w-[360px] flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="EZ-TIX Ticketing"
                  className="w-[80%] max-w-[320px] object-contain drop-shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
