// src/pages/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass !== confirm) {
      setError("Sepertinya ada typo, coba samakan lagi");
      return;
    }
    setError("");
    setSuccess("Ubah kata sandi berhasil");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-extrabold text-center mb-1">EZ-TIX</h1>
      <p className="text-sm text-center text-slate-500 mb-6">Buat kata sandi baru</p>

      {error && (
        <div className="mb-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-3 text-xs text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Email"
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Kata sandi baru"
          type="password"
          placeholder="Masukkan kata sandi baru"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Input
          label="Ulangi kata sandi baru"
          type="password"
          placeholder="Masukkan ulang kata sandi baru"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button type="submit" className="w-full mt-2">
          Ubah kata sandi
        </Button>
      </form>

      <p className="mt-4 text-xs text-slate-500 text-center">
        Kembali ke{" "}
        <Link to="/login" className="text-orange-600 hover:underline">
          halaman login
        </Link>
      </p>
    </div>
  );
}
