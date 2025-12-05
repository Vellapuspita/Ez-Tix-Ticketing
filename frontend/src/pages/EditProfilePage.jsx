// src/pages/EditProfilePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username") || "Selina");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("username", username);
    setSuccess("Profil berhasil diperbarui");
    setTimeout(() => navigate("/profile"), 1000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Edit profil</h2>

      <div className="bg-white rounded-2xl shadow p-5 max-w-md">
        {success && (
          <div className="mb-3 text-xs text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama pengguna"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
