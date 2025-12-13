import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios"; // Pastikan path ini benar!

export default function ProfilePage() {
  const navigate = useNavigate();

  // State untuk Data Profil yang Diambil dari Backend
  const [profile, setProfile] = useState({
    namaPengguna: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk Form Input
  const [newName, setNewName] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // State Popups dan Notifikasi
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const avatarImg = "https://i.pravatar.cc/200"; // Default image

  // ===============================================================
  // A. FUNGSI AMBIL DATA PROFIL (GET)
  // ===============================================================
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await authAxios.get("/profile"); 
      
      const userData = response.data.user;
      setProfile(userData);
      setNewName(userData.namaPengguna); 

    } catch (err) {
      console.error("Error fetching profile:", err);
      // Jika token tidak valid, hapus dan paksa login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError("Gagal mengambil data profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ===============================================================
  // B. FUNGSI SIMPAN SEMUA PERUBAHAN (NAMA & PASSWORD)
  // ===============================================================
  const handleSaveChanges = async () => {
    setShowEditConfirm(false); 
    setIsUpdating(true);
    setError(null); // Reset error

    const isNameChanged = newName !== profile.namaPengguna;
    const isPasswordSet = passwordForm.newPassword.length > 0;
    
    // Validasi Password Lokal
    if (isPasswordSet && passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        setError("Kata sandi baru tidak cocok.");
        setIsUpdating(false);
        return;
    }

    if (!isNameChanged && !isPasswordSet) {
        alert("Tidak ada perubahan untuk disimpan.");
        setIsUpdating(false);
        return;
    }

    try {
        if (isNameChanged) {
            // 1. UPDATE NAMA (PUT /profile)
            await authAxios.put("/profile", { name: newName });
            setProfile(prev => ({...prev, namaPengguna: newName}));
        }

        if (isPasswordSet) {
            // 2. UBAH PASSWORD (POST /reset-password)
            // Kunci field harus sama dengan yang diharapkan backend: kataSandiBaru, ulangiKataSandiBaru
            await authAxios.post("/reset-password", {
                kataSandiBaru: passwordForm.newPassword,        
                ulangiKataSandiBaru: passwordForm.confirmNewPassword, 
            });
            // Reset form password setelah sukses
            setPasswordForm({ newPassword: "", confirmNewPassword: "" }); 
        }

        setSuccessMessage("Profil berhasil diperbarui!");
        setShowSuccessPopup(true);
        
    } catch (err) {
        console.error("Error saving changes:", err.response?.data || err);
        // Ambil pesan error spesifik dari backend (misal: "Email sudah terdaftar", "Password salah")
        setError(err.response?.data?.message || "Gagal menyimpan perubahan. Periksa input Anda.");
    } finally {
        setIsUpdating(false);
    }
  };


  // === Logout ===
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center py-20">Loading data profil...</div>;
  }
  
  // --- RENDERING UI ---
  return (
    <div className="flex justify-center py-10">
      <div className="bg-[#F5F8E9] w-[600px] rounded-2xl p-8 shadow-lg relative">

        <h1 className="text-2xl font-bold mb-6 text-center">Profil Saya</h1>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* FOTO PROFIL */}
        <div className="flex justify-center">
          <img
            src={avatarImg}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover shadow"
          />
        </div>

        {/* ================= FORM NAMA DAN PASSWORD ================= */}
        <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Informasi Akun</h2>

            {/* Nama Pengguna */}
            <div>
                <p className="font-semibold text-sm">Nama Pengguna</p>
                <input
                className="w-full rounded-lg border px-3 py-1"
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                disabled={isUpdating}
                />
            </div>

            {/* Email Pengguna (Read Only) */}
            <div>
                <p className="font-semibold text-sm">Email Pengguna</p>
                <input
                className="w-full rounded-lg border px-3 py-1 bg-gray-200"
                value={profile.email} 
                readOnly
                />
            </div>
            
            <h2 className="text-lg font-semibold border-b pb-2 pt-4">Ubah Kata Sandi</h2>

            {/* Kata Sandi Baru */}
            <div>
                <p className="font-semibold text-sm">Kata Sandi Baru</p>
                <input
                    type="password"
                    className="w-full rounded-lg border px-3 py-1"
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    value={passwordForm.newPassword}
                    placeholder="Biarkan kosong jika tidak ingin mengubah"
                    disabled={isUpdating}
                />
            </div>

            {/* Ulangi Kata Sandi Baru */}
            <div>
                <p className="font-semibold text-sm">Ulangi Kata Sandi Baru</p>
                <input
                    type="password"
                    className="w-full rounded-lg border px-3 py-1"
                    onChange={(e) => setPasswordForm({...passwordForm, confirmNewPassword: e.target.value})}
                    value={passwordForm.confirmNewPassword}
                    placeholder="Biarkan kosong jika tidak ingin mengubah"
                    disabled={isUpdating}
                />
            </div>
        </div>

        {/* TOMBOL SIMPAN UTAMA */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowEditConfirm(true)}
            disabled={isUpdating}
            className="bg-[#F4A623] text-black px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
          >
            {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
        
        {/* LOGOUT BUTTON */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="border border-red-400 text-red-500 px-6 py-1 rounded-lg"
          >
            Keluar Akun
          </button>
        </div>

        {/* ================= POPUP EDIT CONFIRM ================= */}
        {showEditConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
              <p className="font-medium mb-4">
                Apakah Anda yakin ingin menyimpan perubahan?
              </p>

              <div className="flex justify-between px-6">
                <button
                  onClick={handleSaveChanges} 
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

        {/* ================= POPUP SUKSES ================= */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
              <p className="font-medium mb-4 text-green-600">
                {successMessage}
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