import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ validasi dulu
    if (!email || !newPassword || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      setLoading(true);

      // ✅ call backend
      await axios.post("http://localhost:4000/api/auth/reset-password-simple", {
        email,
        kataSandiBaru: newPassword,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal reset kata sandi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <h1 className="text-2xl font-bold mb-1">Reset Kata Sandi</h1>
      <p className="text-sm text-muted mb-6">
        Masukkan email dan kata sandi baru akun Anda
      </p>

      {!success ? (
        <form onSubmit={handleReset} className="space-y-4">
          {/* EMAIL */}
          <div className="space-y-1 text-sm">
            <label className="font-medium">Email</label>
            <input
              type="email"
              className={`w-full rounded-xl border px-3 py-2 text-sm ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD BARU */}
          <div className="space-y-1 text-sm relative">
            <label className="font-medium">Kata sandi baru</label>
            <input
              type={showPass1 ? "text" : "password"}
              className={`w-full rounded-xl border px-3 py-2 pr-10 text-sm ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan kata sandi baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPass1(!showPass1)}
              className="absolute right-3 top-9 text-gray-500"
              disabled={loading}
            >
              {showPass1 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div className="space-y-1 text-sm relative">
            <label className="font-medium">Konfirmasi kata sandi</label>
            <input
              type={showPass2 ? "text" : "password"}
              className={`w-full rounded-xl border px-3 py-2 pr-10 text-sm ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ulangi kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPass2(!showPass2)}
              className="absolute right-3 top-9 text-gray-500"
              disabled={loading}
            >
              {showPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : "Reset kata sandi"}
          </button>
        </form>
      ) : (
        <div className="text-sm">
          <p className="text-green-600 font-medium mb-3">
            Kata sandi berhasil direset!
          </p>
          <Link to="/login" className="text-primary font-medium">
            Kembali ke login
          </Link>
        </div>
      )}
    </div>
  );
}
