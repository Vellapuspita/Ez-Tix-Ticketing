import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "Selina Maharani",
    email: "maharanisln123@gmail.com",
    phone: "081345678012",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    localStorage.getItem("profilePhoto") || null
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePickPhoto = () => fileRef.current?.click();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // base64 string
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSave = async (e) => {
    e.preventDefault();

    // ✅ simpan foto ke localStorage biar halaman /profile bisa pakai
    if (photoFile) {
      const base64 = await fileToBase64(photoFile);
      localStorage.setItem("profilePhoto", base64);
    }

    // (opsional) simpan data lain juga
    localStorage.setItem("profileName", form.name);
    localStorage.setItem("profileEmail", form.email);
    localStorage.setItem("profilePhone", form.phone);

    navigate("/profile");
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">Edit Profil</h1>

      {/* FOTO */}
      <div className="flex items-center gap-4">
        <img
          src={photoPreview || "https://via.placeholder.com/96?text=Foto"}
          alt="Foto Profil"
          className="w-24 h-24 rounded-full object-cover border border-gray-200"
        />
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            onClick={handlePickPhoto}
            className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Upload Foto
          </button>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSave} className="space-y-4 text-sm">
        {/* ...input name/email/phone sama seperti punyamu... */}
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
