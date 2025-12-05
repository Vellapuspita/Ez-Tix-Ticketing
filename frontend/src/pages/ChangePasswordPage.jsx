// src/pages/ChangePasswordPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setError("Sepertinya ada typo, coba samakan lagi.");
      return;
    }
    setError("");
    setSuccess("Kata sandi berhasil diperbarui");
    setTimeout(() => navigate("/profile"), 1000);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold text-[#222]">Ubah kata sandi</h2>

      <div className="bg-white rounded-3xl shadow-md p-6">
        {error && (
          <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 text-xs text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              value="maharanisln123@gmail.com"
              disabled
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Kata sandi baru</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Ulangi kata sandi baru</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm rounded-full bg-[#F0A33F] text-black font-semibold shadow hover:bg-[#f3b455]"
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
