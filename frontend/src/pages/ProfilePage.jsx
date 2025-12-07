import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const avatarImg = "https://i.pravatar.cc/200";

  // === Ketika klik "Iya" pada edit profil ===
  const handleConfirmEdit = () => {
    setShowEditConfirm(false);
    setShowSuccessPopup(true); // tampilkan pop-up berhasil diubah
  };

  // === Ketika klik "Iya" logout ===
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-center py-10">
      <div className="bg-[#F5F8E9] w-[600px] rounded-2xl p-8 shadow-lg relative">

        {/* FOTO PROFIL */}
        <div className="flex justify-center">
          <img
            src={avatarImg}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover shadow"
          />
        </div>

        {/* TOMBOL EDIT */}
        <div className="flex justify-end mt-3">
          <button
            onClick={() => setShowEditConfirm(true)}
            className="bg-[#F4A623] text-black px-4 py-1 rounded-lg font-medium"
          >
            Edit Profil
          </button>
        </div>

        {/* DATA USER */}
        <div className="mt-6 space-y-3">
          <div>
            <p className="font-semibold text-sm">Nama Pengguna</p>
            <input
              className="w-full rounded-lg border px-3 py-1"
              defaultValue="Selina Maharani"
            />
          </div>

          <div>
            <p className="font-semibold text-sm">Email Pengguna</p>
            <input
              className="w-full rounded-lg border px-3 py-1"
              defaultValue="maharanisln123@gmail.com"
            />
          </div>

          <div>
            <p className="font-semibold text-sm">No. HP</p>
            <input
              className="w-full rounded-lg border px-3 py-1"
              defaultValue="081345678012"
            />
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="border border-red-400 text-red-500 px-6 py-1 rounded-lg"
          >
            Keluar
          </button>
        </div>

        {/* ================= POPUP EDIT CONFIRM ================= */}
        {showEditConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
              <p className="font-medium mb-4">
                Apakah perubahan akan disimpan?
              </p>

              <div className="flex justify-between px-6">
                <button
                  onClick={handleConfirmEdit}
                  className="bg-[#F4A623] text-white px-4 py-1 rounded-lg"
                >
                  Iya
                </button>

                <button
                  onClick={() => setShowEditConfirm(false)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= POPUP SUKSES EDIT ================= */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
              <p className="font-medium mb-4 text-green-600">
                Profil berhasil diubah!
              </p>

              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-[#F4A623] text-white px-6 py-1 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* ================= POPUP LOGOUT CONFIRM ================= */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
              <p className="font-medium mb-4">Anda yakin ingin keluar?</p>

              <div className="flex justify-between px-6">
                <button
                  onClick={handleConfirmLogout}
                  className="bg-[#F4A623] text-white px-4 py-1 rounded-lg"
                >
                  Iya
                </button>

                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
