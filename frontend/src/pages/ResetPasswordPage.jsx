import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
    // TODO: API Forgot Password
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <h1 className="text-2xl font-bold mb-1">Lupa kata sandi?</h1>
      <p className="text-sm text-muted mb-6">
        Masukkan email terdaftar untuk reset kata sandi
      </p>

      {!sent ? (
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-1 text-sm">
            <label className="font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Masukkan email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold"
          >
            Kirim link reset
          </button>
        </form>
      ) : (
        <div className="text-sm">
          <p className="text-green-600 font-medium mb-3">
            Link reset kata sandi telah dikirim ke email Anda!
          </p>
          <Link to="/login" className="text-primary font-medium">
            Kembali ke login
          </Link>
        </div>
      )}
    </div>
  );
}
