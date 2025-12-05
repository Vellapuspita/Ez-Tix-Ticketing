// src/pages/ChangePasswordPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setError("Sepertinya ada typo, coba samakan lagi");
      return;
    }
    setError("");
    setSuccess("Kata sandi berhasil diperbarui");
    setTimeout(() => navigate("/profile"), 1000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Ubah kata sandi</h2>

      <div className="bg-white rounded-2xl shadow p-5 max-w-md">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            value="maharanisln123@gmail.com"
            disabled
          />
          <Input
            label="Kata sandi baru"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <Input
            label="Ulangi kata sandi baru"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 text-sm rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <Button type="submit">Perbarui</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
