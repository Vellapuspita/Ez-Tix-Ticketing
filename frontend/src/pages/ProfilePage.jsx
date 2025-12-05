// src/pages/ProfilePage.jsx
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const username = localStorage.getItem("username") || "Pengguna";
  const email = "maharanisln123@gmail.com";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Profil</h2>

      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-sm font-semibold mb-1">Nama pengguna</p>
        <p className="text-sm text-slate-700 mb-3">{username}</p>

        <p className="text-sm font-semibold mb-1">Email</p>
        <p className="text-sm text-slate-700 mb-4">{email}</p>

        <p className="text-sm font-semibold mb-1">Kata sandi</p>
        <p className="text-sm text-slate-700 mb-4">**********</p>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/profile/edit"
            className="px-4 py-2 text-sm rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Edit profil
          </Link>
          <Link
            to="/profile/change-password"
            className="px-4 py-2 text-sm rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Ubah kata sandi
          </Link>
        </div>
      </div>
    </div>
  );
}
