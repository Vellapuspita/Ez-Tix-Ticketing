import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError("Kata sandi baru tidak cocok!");
      return;
    }

    // TODO: API Change Password
    navigate("/profile");
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">Ganti Kata Sandi</h1>

      <form onSubmit={handleSave} className="space-y-4 text-sm">
        <div className="space-y-1">
          <label className="font-medium">Kata sandi lama</label>
          <input
            name="oldPassword"
            type="password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            placeholder="Masukkan kata sandi lama"
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">Kata sandi baru</label>
          <input
            name="newPassword"
            type="password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            placeholder="Masukkan kata sandi baru"
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">Ulangi kata sandi baru</label>
          <input
            name="confirmPassword"
            type="password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            placeholder="Ulangi kata sandi baru"
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
