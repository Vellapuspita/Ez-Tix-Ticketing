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
      await new Promise((r) => setTimeout(r, 500));

      if (email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password) {
        localStorage.setItem("adminToken", "dummy-admin-token");
        localStorage.setItem("adminName", DUMMY_ADMIN.name);
        navigate("/admin", { replace: true });
        return;
      }

      setError("Login admin gagal. Periksa email dan kata sandi Anda.");
    } catch {
      setError("Terjadi kesalahan saat login admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background konser */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/background.jpg')",
          }}
        />
        {/* gelap tipis biar mirip figma */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Wrapper */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
        {/* Card besar */}
        <div className="w-full max-w-[980px] rounded-[22px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT: Form */}
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
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-[44px] rounded-xl px-4 text-sm outline-none border shadow-sm
                      ${error ? "border-red-500" : "border-black/15"}
                    `}
                    required
                  />
                </div>

                {/* Password */}
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
                      className={`w-full h-[44px] rounded-xl px-4 pr-11 text-sm outline-none border shadow-sm
                        ${error ? "border-red-500" : "border-black/15"}
                      `}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setError("Fitur reset password admin belum tersedia.")
                      }
                      className="text-[11px] text-black/60 hover:text-black"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 text-center">{error}</p>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[44px] rounded-xl bg-[#F28B3C] hover:bg-[#ea7f2e] text-white font-bold text-sm shadow disabled:bg-gray-400"
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </button>

                {/* Footer link */}
                <p className="text-xs text-black/60 text-center pt-2">
                  Belum punya akun?{" "}
                  <Link
                    to="/register"
                    className="text-[#F28B3C] font-semibold hover:underline"
                  >
                    Daftar Sekarang!
                  </Link>
                </p>

                {/* optional: link balik */}
                <p className="text-[11px] text-black/40 text-center">
                  <Link to="/login" className="hover:underline">
                    Kembali ke login customer
                  </Link>
                </p>

                {/* Dummy hint (kalau mau disembunyikan tinggal hapus) */}
                <div className="mt-3 text-[11px] text-black/40 text-center">
                  {/* Dummy admin: <b>admin@eztix.com</b> / <b>admin123</b> */}
                </div>
              </form>
            </div>

            {/* RIGHT: Panel logo */}
            <div className="bg-[#EEF0E3] flex items-center justify-center p-8 sm:p-10">
              <div className="w-full max-w-[360px] aspect-[4/3] bg-[#EEF0E3] flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="EZ-TIX Ticketing"
                  className="w-[80%] max-w-[320px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
