// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy auth; nanti sambung ke backend
    if (email && password) {
      // contoh validasi sederhana
      if (password.length < 4) {
        setErrorMsg("Ups! Email atau password kamu tidak cocok");
        return;
      }

      localStorage.setItem("token", "dummy-token");
      localStorage.setItem("username", "Selina Maharani");
      navigate(redirect, { replace: true });
    } else {
      setErrorMsg("Ups! Email atau password kamu tidak cocok");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-1">
        SELAMAT DATANG DI EZ-TIX
      </h1>
      <p className="text-sm text-slate-500 mb-6">Satu klik, ribuan pengalaman</p>

      {errorMsg && (
        <div className="mb-3 text-xs text-red-500 font-medium bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {errorMsg}
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
          label="Kata sandi"
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end">
          <Link
            to="/reset-password"
            className="text-xs text-slate-500 hover:text-orange-600 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>

        <Button type="submit" className="w-full mt-2">
          Masuk
        </Button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Belum punya akun?{" "}
        <Link to="/register" className="text-orange-600 hover:underline">
          Daftar Sekarang!
        </Link>
      </p>
    </div>
  );
}
