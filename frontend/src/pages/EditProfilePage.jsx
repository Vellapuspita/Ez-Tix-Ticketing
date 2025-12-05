// src/pages/EditProfilePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Selina Maharani"
  );
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("username", username);
    setSuccess("Profil berhasil diperbarui");
    setTimeout(() => navigate("/profile"), 1000);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold text-[#222]">Edit profil</h2>

      <div className="bg-white rounded-3xl shadow-md p-6">
        {success && (
          <div className="mb-3 text-xs text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama pengguna</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
