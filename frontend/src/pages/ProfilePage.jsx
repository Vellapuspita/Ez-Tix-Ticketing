// src/pages/ProfilePage.jsx
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const username = localStorage.getItem("username") || "Pengguna";
  const email = "maharanisln123@gmail.com";

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold text-[#222]">Profil</h2>

      <div className="bg-white rounded-3xl shadow-md p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold mb-1">Nama pengguna</p>
          <p className="text-sm text-gray-700">{username}</p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">Email</p>
          <p className="text-sm text-gray-700">{email}</p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">Kata sandi</p>
          <p className="text-sm text-gray-700">**********</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/profile/edit"
            className="px-4 py-2 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Edit profil
          </Link>
          <Link
            to="/profile/change-password"
            className="px-4 py-2 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Ubah kata sandi
          </Link>
        </div>
      </div>
    </div>
  );
}
