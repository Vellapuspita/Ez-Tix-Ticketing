import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";

const API_ORIGIN = "http://localhost:4000"; // sama dengan server BE kamu

export default function ProfilePage() {
  const navigate = useNavigate();

  // =========================
  // State Profil dari Backend
  // =========================
  const [profile, setProfile] = useState({
    namaPengguna: "",
    email: "",
    profilePicture: null,
  });

  // preview foto (bisa dari backend url atau blob url)
  const [photoPreview, setPhotoPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // Form Input
  // =========================
  const [newName, setNewName] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // =========================
  // Popups
  // =========================
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // Helper: build avatar URL
  // =========================
  const buildAvatarUrl = (pathOrUrl) => {
    if (!pathOrUrl) return "";
    // kalau sudah full url, pakai langsung
    if (String(pathOrUrl).startsWith("http")) return pathOrUrl;
    // kalau path /uploads/...
    return `${API_ORIGIN}${pathOrUrl}`;
  };

  // =========================
  // A. GET PROFILE
  // =========================
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // IMPORTANT: pakai "/" biar gak jadi /apiauth/...
      const response = await authAxios.get("/auth/profile");
      const userData = response.data.user;

      setProfile(userData);
      setNewName(userData.namaPengguna || "");

      setPhotoPreview(buildAvatarUrl(userData.profilePicture));
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError("Gagal mengambil data profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // Upload Foto Profil (khusus)
  // Endpoint: PUT /auth/profile/picture
  // =========================
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      alert("Format foto harus JPG/PNG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB.");
      return;
    }

    const prevUrl = buildAvatarUrl(profile.profilePicture);

    // preview instan
    const localPreview = URL.createObjectURL(file);
    setPhotoPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await authAxios.put("/auth/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user;
      setProfile(updatedUser);

      // persist preview dari backend (bukan blob)
      setPhotoPreview(buildAvatarUrl(updatedUser.profilePicture));

      setSuccessMessage("Foto profil berhasil diperbarui!");
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Upload foto error:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal upload foto.");
      setPhotoPreview(prevUrl);
    } finally {
      URL.revokeObjectURL(localPreview);
      // reset input biar bisa upload file yang sama lagi
      e.target.value = "";
    }
  };

  // =========================
  // B. SAVE CHANGES (Nama & Password)
  // =========================
  const handleSaveChanges = async () => {
    setShowEditConfirm(false);
    setIsUpdating(true);
    setError(null);

    const isNameChanged = newName !== profile.namaPengguna;
    const isPasswordSet = passwordForm.newPassword.length > 0;

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
        await authAxios.put("/auth/profile", { name: newName });
        setProfile((prev) => ({ ...prev, namaPengguna: newName }));
      }

      if (isPasswordSet) {
        await authAxios.post("/auth/reset-password", {
          kataSandiBaru: passwordForm.newPassword,
          ulangiKataSandiBaru: passwordForm.confirmNewPassword,
        });
        setPasswordForm({ newPassword: "", confirmNewPassword: "" });
      }

      setSuccessMessage("Profil berhasil diperbarui!");
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Error saving changes:", err.response?.data || err);
      setError(err.response?.data?.message || "Gagal menyimpan perubahan. Periksa input Anda.");
    } finally {
      setIsUpdating(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center py-20">Loading data profil...</div>;
  }

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-[#F5F8E9] w-full max-w-xl rounded-2xl p-8 shadow-lg relative">
        <h1 className="text-2xl font-bold mb-6 text-center">Profil Saya</h1>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* FOTO PROFIL */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={photoPreview || "https://via.placeholder.com/150?text=Foto"}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover shadow"
          />

          <label className="cursor-pointer bg-[#F4A623] text-black px-4 py-2 rounded-lg text-sm font-medium">
            Upload Foto
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        {/* FORM NAMA DAN PASSWORD */}
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Informasi Akun</h2>

          <div>
            <p className="font-semibold text-sm">Nama Pengguna</p>
            <input
              className="w-full rounded-lg border px-3 py-1"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isUpdating}
            />
          </div>

          <div>
            <p className="font-semibold text-sm">Email Pengguna</p>
            <input
              className="w-full rounded-lg border px-3 py-1 bg-gray-200"
              value={profile.email || ""}
              readOnly
            />
          </div>

          <h2 className="text-lg font-semibold border-b pb-2 pt-4">Ubah Kata Sandi</h2>

          <div>
            <p className="font-semibold text-sm">Kata Sandi Baru</p>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-1"
              onChange={(e) =>
                setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
              }
              value={passwordForm.newPassword}
              placeholder="Biarkan kosong jika tidak ingin mengubah"
              disabled={isUpdating}
            />
          </div>

          <div>
            <p className="font-semibold text-sm">Ulangi Kata Sandi Baru</p>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-1"
              onChange={(e) =>
                setPasswordForm((p) => ({ ...p, confirmNewPassword: e.target.value }))
              }
              value={passwordForm.confirmNewPassword}
              placeholder="Biarkan kosong jika tidak ingin mengubah"
              disabled={isUpdating}
            />
          </div>
        </div>

        {/* BUTTON SIMPAN */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowEditConfirm(true)}
            disabled={isUpdating}
            className="bg-[#F4A623] text-black px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
          >
            {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        {/* LOGOUT */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="border border-red-400 text-red-500 px-6 py-1 rounded-lg"
          >
            Keluar Akun
          </button>
        </div>

        {/* POPUP EDIT CONFIRM */}
        {showEditConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
              <p className="font-medium mb-4">Apakah Anda yakin ingin menyimpan perubahan?</p>

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

        {/* POPUP SUKSES */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
              <p className="font-medium mb-4 text-green-600">{successMessage}</p>

              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-[#F4A623] text-white px-6 py-1 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* POPUP LOGOUT CONFIRM */}
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
