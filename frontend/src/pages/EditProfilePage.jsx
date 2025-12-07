import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "Selina Maharani",
    email: "maharanisln123@gmail.com",
    phone: "081345678012",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: API Update Profile
    navigate("/profile");
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">Edit Profil</h1>

      <form onSubmit={handleSave} className="space-y-4 text-sm">
        <div className="space-y-1">
          <label className="font-medium">Nama Lengkap</label>
          <input
            name="name"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/50"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/50"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">No. HP</label>
          <input
            name="phone"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary/50"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
